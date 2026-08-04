from flask import jsonify


from datetime import datetime

from Controllers.ChatController import ChatController
from Models.Notice import Notice

from db import db


class NoticeController:

    @staticmethod
    def create_broadcast_notice(data):
        message = data.get("message")
        date_str = data.get("date")
        time_str = data.get("time")

        if not message:
            return jsonify({"error": "Message is required"}), 400

        is_scheduled = bool(date_str and time_str)

        try:
            scheduled_date = datetime.strptime(date_str, "%Y-%m-%d").date() if date_str else None
            scheduled_time = datetime.strptime(time_str, "%H:%M:%S").time() if time_str else None
        except Exception:
            return jsonify({"error": "Invalid date or time format. Use YYYY-MM-DD and HH:MM:SS"}), 400

        phone_numbers = ChatController.fetch_phonenumbers()

        for phone in phone_numbers:
            notice = Notice(
                message=message,
                receiver=phone,
                is_scheduled=is_scheduled,
                date=scheduled_date,
                time=scheduled_time
            )
            db.session.add(notice)

        db.session.commit()

        return jsonify({
            "status": "Broadcast notice created",
            "count": len(phone_numbers),
            "scheduled": is_scheduled
        })

    @staticmethod
    def create_selected_notice(data):
        message = data.get("message")
        phone_numbers = data.get("phone_numbers", [])
        date_str = data.get("date")
        time_str = data.get("time")

        if not message:
            return jsonify({"error": "Message is required"}), 400
        if not isinstance(phone_numbers, list) or not phone_numbers:
            return jsonify({"error": "phone_numbers must be a non-empty list"}), 400

        is_scheduled = bool(date_str and time_str)
        now = datetime.now()
        try:
            scheduled_date = datetime.strptime(date_str, "%Y-%m-%d").date() if date_str else now.date()
            scheduled_time = datetime.strptime(time_str, "%H:%M:%S").time() if time_str else now.time()

        except Exception:
            return jsonify({"error": "Invalid date or time format. Use YYYY-MM-DD and HH:MM:SS"}), 400

        for phone in phone_numbers:
            notice = Notice(
                message=message,
                receiver=phone,
                is_scheduled=is_scheduled,
                date=scheduled_date,
                time=scheduled_time
            )
            db.session.add(notice)

        db.session.commit()

        return jsonify({
            "status": "Selected notice created",
            "count": len(phone_numbers),
            "scheduled": is_scheduled
        })

    @staticmethod
    def fetch_notice():
        try:
            notices = Notice.query.order_by(
                Notice.is_scheduled.desc(),
                Notice.date.desc(),
                Notice.time.desc()
            ).all()
            data = [n.as_dict() for n in notices]
            return jsonify(data)
        except Exception as e:
            print(f"Error in fetch_notice: {e}")  # Optional but helpful for debugging
            return jsonify({"error": "Server error occurred"}), 500


    @staticmethod
    def fetch_notice_receiver(receiver):
        try:
            notices = Notice.query.filter_by(receiver=receiver).order_by(
                Notice.is_scheduled.desc(),
                Notice.date.desc(),
                Notice.time.desc()
            ).all()
            data = [n.as_dict() for n in notices]
            return jsonify(data)
        except Exception as e:
            print(f"Error in fetch_notice: {e}")  # Optional but helpful for debugging
            return jsonify({"error": "Server error occurred"}), 500

    @staticmethod
    def fetch_pending_scheduled_notice(receiver):
        try:
            now = datetime.now()
            today = now.date()
            current_time = now.time()

            notices = Notice.query.filter(
                Notice.receiver == receiver,
                Notice.is_scheduled == True,
                Notice.status == False,
                Notice.date == today,
                Notice.time <= current_time
            ).all()

            data = [n.as_dict() for n in notices]

            # ✅ Optional: Auto-update status = True (1) after sending
            for n in notices:
                n.status = True

            db.session.commit()

            return jsonify(data)
        except Exception as e:
            print(f"Error in fetch_pending_scheduled_notice: {e}")
            return jsonify({"error": "Server error"}), 500