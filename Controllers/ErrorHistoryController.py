from flask import jsonify, request
from Models.ErrorHistory import ErrorHistory           # ← import the model you created
from db import db

class ErrorHistoryController:

    @staticmethod
    def add_error_history():

        try:
            data = request.json or {}
            chat_id = data.get('chatId')
            tag     = data.get('tag')

            # basic validation
            if chat_id is None or tag is None:
                return jsonify({'error': 'chatId and tag are required'}), 400

            try:
                chat_id = int(chat_id)
            except ValueError:
                return jsonify({'error': 'chatId must be an integer'}), 400

            new_row = ErrorHistory(chatId=chat_id, tag=tag, isDeleted=False)
            db.session.add(new_row)
            db.session.commit()

            return jsonify({'message': 'ErrorHistory added successfully!',
                            'id': new_row.id})

        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

    @staticmethod
    def save_error(error_obj):
        try:
            db.session.add(error_obj)
            db.session.commit()
            return error_obj  # You can also return error_obj.as_dict() if needed
        except Exception as e:
            db.session.rollback()
            print(f"Error saving error history: {str(e)}")
            return None

    @staticmethod
    def get_all_error_history():
        try:
            rows = ErrorHistory.query.filter_by(isDeleted=False).all()
            return jsonify([row.as_dict() for row in rows])
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @staticmethod
    def get_error_history_by_id(eid):
        try:
            row = ErrorHistory.query.get_or_404(eid)
            return jsonify(row.as_dict())
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @staticmethod
    def get_error_history_by_chat(chat_id):
        """Optional helper – list all error‑history rows for a specific chat"""
        try:
            rows = (ErrorHistory.query
                    .filter_by(chatId=chat_id, isDeleted=False)
                    .all())
            return jsonify([r.as_dict() for r in rows])
        except Exception as e:
            return jsonify({'error': str(e)}), 500



    @staticmethod
    def delete_error_history(eid):
        """
        Soft‑delete → sets isDeleted = True
        """
        try:
            row = ErrorHistory.query.get(eid)
            if not row:
                return jsonify({'error': 'ErrorHistory not found'}), 404

            row.isDeleted = True
            db.session.commit()
            return jsonify({'message': 'ErrorHistory deleted successfully!'})
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
