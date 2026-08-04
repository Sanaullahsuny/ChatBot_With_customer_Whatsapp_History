from App import app
from db import db

# Use app context to ensure SQLAlchemy is aware of the app
with app.app_context():
    db.create_all()
    print("All tables created successfully.")
