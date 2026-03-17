from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
from flask_socketio import SocketIO, emit, join_room
import random
import string
import os
from datetime import datetime, timedelta
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config["PORT"] = int(os.environ.get("PORT", 10000))
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")
# ---------------------------
# Upload Folder
# ---------------------------
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# ---------------------------
# Serve Images
# ---------------------------
IMAGE_FOLDER = "images"
os.makedirs(IMAGE_FOLDER, exist_ok=True)

@app.route("/images/<filename>")
def get_image(filename):
    return send_from_directory(IMAGE_FOLDER, filename)

@app.route("/uploads/<filename>")
def get_upload(filename):
    return send_from_directory("uploads", filename)
@app.route("/")
def home():
    return {"message": "CampusKart Backend Running"}


# ---------------------------
# MongoDB Connection
# ---------------------------
MONGO_URI = os.environ.get("MONGO_URI")

if not MONGO_URI:
    raise Exception("MONGO_URI not set in environment variables")

client = MongoClient(MONGO_URI)
db = client["CampusKartDB"]

products_collection = db["products"]
orders_collection = db["orders"]
group_orders_collection = db["group_orders"]

users_collection = db["users"]
books_collection = db["books"]
vendors_collection = db["vendors"]
wallet_balance = 500
loans_collection = db["student_loans"]

# ---------------------------
# Generate Products
# ---------------------------
def generate_products():

    products = []

    food_items = [
        "Burger","Pizza","Noodles","Biryani","Fried Rice",
        "Sandwich","Pasta","Coffee","Milkshake","Tea"
    ]

    categories = {
        "Food": food_items
    }

    for category, items in categories.items():
        for item in items:
            product = {
                "name": item,
                "category": category,
                "price": random.randint(80,800),
                "studentDiscount": random.randint(5,20),
                "image": f"/images/{item.lower().replace(' ','')}.jpg"
            }

            # ✅ only insert if not already exists
            if not products_collection.find_one({"name": item}):
                products_collection.insert_one(product)

    print("Products added without deleting old ones!")


@app.route("/generate-products")
def generate_products_api():
    generate_products()
    return {"message": "Products added"}
# ---------------------------
# Student Signup with Document Upload
# ---------------------------
@app.route("/signup", methods=["POST"])
def signup():

    name = request.form.get("name")
    email = request.form.get("email")
    password = request.form.get("password")

    pan_card = request.files.get("pan")
    student_id = request.files.get("student_id")

    if not pan_card or not student_id:
        return jsonify({"message": "PAN card and Student ID required"}), 400

    pan_filename = secure_filename(pan_card.filename)
    student_filename = secure_filename(student_id.filename)

    pan_path = os.path.join(app.config["UPLOAD_FOLDER"], pan_filename)
    student_path = os.path.join(app.config["UPLOAD_FOLDER"], student_filename)

    pan_card.save(pan_path)
    student_id.save(student_path)

    user = {
        "name": name,
        "email": email,
        "password": password,
        "wallet": 500,
        "pan_card": pan_filename,
        "student_id": student_filename,
        "verified": True
    }

    users_collection.insert_one(user)

    return jsonify({"message": "Signup successful. Waiting for verification"})

# ---------------------------
# Admin Verify Student
# ---------------------------
@app.route("/admin/verify", methods=["POST"])
def verify_student():

    data = request.json
    email = data["email"]

    users_collection.update_one(
        {"email": email},
        {"$set": {"verified": True}}
    )

    return jsonify({"message": "User verified successfully"})


# ---------------------------
# Student Login
# ---------------------------
@app.route("/login", methods=["POST"])
def login():

    # get data from React
    data = request.get_json()

    print("Request data:", data)

    email = data.get("email", "").strip()
    password = data.get("password", "").strip()

    print("Email:", email)
    print("Password:", password)

    # find user by email
    user = users_collection.find_one({"email": email})

    print("User from DB:", user)

    if user:

        if user["password"] != password:
            return jsonify({"message": "Wrong password"}), 401

        if not user.get("verified", False):
            return jsonify({"message": "Account waiting for verification"}), 403

        return jsonify({
            "message": "Login successful",
            "name": user["name"],
            "wallet": user.get("wallet", 0)
        })

    return jsonify({"message": "Invalid credentials"}), 401

# ---------------------------
# Products API
# ---------------------------
@app.route("/products")
def get_products():
    try:
        products = list(products_collection.find({}, {"_id": 0}))
        return jsonify(products)
    except Exception as e:
        return {"error": str(e)}, 500

# ---------------------------
# Wallet API
# ---------------------------
@app.route("/wallet")
def get_wallet():
    return jsonify({"balance": wallet_balance})


@app.route("/wallet/pay", methods=["POST"])
def pay_wallet():

    global wallet_balance

    data = request.json
    amount = data["amount"]
    items = data["items"]

    if wallet_balance >= amount:

        wallet_balance -= amount

        order = {
            "items": items,
            "total": amount,
            "status": "completed"
        }

        orders_collection.insert_one(order)

        return jsonify({
            "message": "Payment successful",
            "balance": wallet_balance
        })

    return jsonify({"message": "Insufficient balance"}), 400


# ---------------------------
# Orders API
# ---------------------------
@app.route("/orders")
def get_orders():
    orders = list(orders_collection.find({}, {"_id": 0}))
    return jsonify(orders)


# ---------------------------
# Second Hand Books
# ---------------------------
@app.route("/books", methods=["GET"])
def get_books():

    books = list(books_collection.find({}, {"_id": 0}))
    return jsonify(books)


@app.route("/books", methods=["POST"])
def sell_book():

    # If image uploaded
    if "image" in request.files:

        title = request.form.get("title")
        price = request.form.get("price")
        seller = request.form.get("seller")
        condition = request.form.get("condition")

        image = request.files["image"]

        filename = secure_filename(image.filename)

        image_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        image.save(image_path)

        image_url = f"/uploads/{filename}"

    else:
        data = request.json

        title = data["title"]
        price = data["price"]
        seller = data["seller"]
        condition = data["condition"]

        image_url = data.get("image", "/images/defaultbook.jpg")

    book = {
        "title": title,
        "price": price,
        "seller": seller,
        "condition": condition,
        "image": image_url
    }

    books_collection.insert_one(book)

    return jsonify({"message": "Book listed successfully"})


# ---------------------------
# Vendor Dashboard
# ---------------------------
@app.route("/vendor/signup", methods=["POST"])
def vendor_signup():

    data = request.json

    vendor = {
        "name": data["name"],
        "email": data["email"],
        "shop": data["shop"]
    }

    vendors_collection.insert_one(vendor)

    return jsonify({"message": "Vendor registered"})


@app.route("/vendor/product", methods=["POST"])
def vendor_add_product():

    data = request.json

    product = {
        "name": data["name"],
        "category": data["category"],
        "price": data["price"],
        "studentDiscount": data["discount"],
        "image": data["image"]
    }

    products_collection.insert_one(product)

    return jsonify({"message": "Product added"})

# ---------------------------
# BOOK CHAT SYSTEM
# ---------------------------

@socketio.on("join_book_chat")
def join_book_chat(data):

    room = data["room"]

    join_room(room)

    emit("chat_status", {"message": "User joined chat"}, room=room)


@socketio.on("send_book_message")
def send_book_message(data):

    room = data["room"]

    message = {
        "user": data["user"],
        "text": data["text"]
    }

    emit("receive_book_message", message, room=room)

# ---------------------------
# 📌 Apply Loan API
# ---------------------------
from datetime import datetime

def check_late_payment(loan):

    today = datetime.now().strftime("%Y-%m-%d")

    if today > loan["next_payment_date"]:

        penalty = loan["monthly_interest"] * 0.1  # 10% penalty
        new_late_fee = loan.get("late_fees", 0) + penalty

        new_credit_score = loan.get("credit_score", 700) - 20

        loans_collection.update_one(
            {"_id": loan["_id"]},
            {
                "$set": {
                    "late_fees": new_late_fee,
                    "credit_score": new_credit_score
                }
            }
        )

@app.route("/loan/apply", methods=["POST"])
def apply_loan():

    data = request.json

    student = data.get("student")
    amount = data.get("amount")

    if not student or not amount:
        return jsonify({"error": "Invalid data"})

    # Check if loan already exists
    existing = loans_collection.find_one(
        {"student": student, "status": "active"}
    )

    if existing:
        return jsonify({"message": "Active loan already exists"})

    principal = amount
    monthly_interest = int(principal * 0.05)

    loan = {
        "student": student,
        "principal": principal,
        "remaining_principal": principal,
        "monthly_interest": monthly_interest,
        "months_remaining": 6,
        "next_payment_date": (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d"),
        "credit_score": 700,
        "late_fees": 0,
        "status": "active"
        }

    loans_collection.insert_one(loan)

    return jsonify({
        "message": "Loan approved",
        "loan": loan
    })
# ---------------------------
# 📌 Get Loan Details
# ---------------------------
@app.route("/loan/<student>")
def get_loan(student):

    loan = loans_collection.find_one(
        {"student": student, "status": "active"}
    )

    if loan:
        check_late_payment(loan)

        loan.pop("_id")

        return jsonify(loan)

    return jsonify({"message": "No active loan"})
# ---------------------------
# 📌 Repay Loan
# ---------------------------

@app.route("/loan/repay", methods=["POST"])
def repay_loan():

    data = request.json

    student = data["student"]
    amount = data["amount"]

    loan = loans_collection.find_one(
        {"student": student, "status": "active"}
    )

    if not loan:
        return jsonify({"message": "No loan found"}), 404

    remaining = loan["remaining_principal"] - amount

    if remaining <= 0:

        loans_collection.update_one(
            {"_id": loan["_id"]},
            {"$set": {"remaining_principal": 0, "status": "paid"}}
        )

        return jsonify({"message": "Loan fully repaid"})

    else:

        loans_collection.update_one(
            {"_id": loan["_id"]},
            {"$set": {"remaining_principal": remaining}}
        )

        return jsonify({
            "message": "Payment successful",
            "remaining": remaining
        })
# ---------------------------
#Interest Payment API (Monthly)
# ---------------------------
@app.route("/loan/pay-interest", methods=["POST"])
def pay_interest():

    data = request.json
    student = data["student"]

    loan = loans_collection.find_one(
        {"student": student, "status": "active"}
    )

    if not loan:
        return jsonify({"message": "No active loan"}), 404

    months_left = loan["months_remaining"] - 1

    if months_left <= 0:
        return jsonify({"message": "Loan period finished. Pay principal"})

    # convert string date to datetime
    current_due_date = datetime.strptime(
        loan["next_payment_date"], "%Y-%m-%d"
    )

    # add 30 days to previous due date
    new_due_date = current_due_date + timedelta(days=30)

    loans_collection.update_one(
        {"_id": loan["_id"]},
        {"$set": {
            "months_remaining": months_left,
            "next_payment_date": new_due_date.strftime("%Y-%m-%d")
        }}
    )

    return jsonify({
        "message": "Monthly interest paid",
        "months_remaining": months_left,
        "next_payment_date": new_due_date.strftime("%Y-%m-%d")
    })
# ---------------------------
# Principal Repayment API
# ---------------------------

@app.route("/loan/pay-principal", methods=["POST"])
def pay_principal():

    data = request.json
    student = data["student"]

    loan = loans_collection.find_one(
        {"student": student, "status": "active"}
    )

    if not loan:
        return jsonify({"message": "No loan found"}), 404

    loans_collection.update_one(
        {"_id": loan["_id"]},
        {"$set": {"remaining_principal": 0, "status": "paid"}}
    )

    return jsonify({"message": "Loan fully paid"})

# ---------------------------
# Run Server
# ---------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    socketio.run(app, host="0.0.0.0", port=port)
