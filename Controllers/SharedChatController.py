
#import uuid  # 👈 Add this at the top
from flask import request, jsonify
from Models.Sharedchat import SharedChat
from db import db
from datetime import datetime

class SharedChatController:

    @staticmethod
    def get_all_shared_chats():
        chats = SharedChat.query.all()
        return jsonify([chat.as_dict() for chat in chats]), 200

    @staticmethod
    def add_shared_chats_bulk():
        data = request.json
        chats = data.get('chats')
        print(chats)
        if not chats or not isinstance(chats, list):
            return jsonify({'error': 'A list of chats is required'}), 400

        added_chats = []
        for item in chats:
            sender_id = (item.get('sender_id'))
            receiver_id = item.get('receiver_id')
            question = item.get('question')
            answer = item.get('answer')
            status = item.get('status', False)

            if not sender_id or not receiver_id:
                continue  # skip invalid entries

            is_voice = str(answer).lower().endswith('.aac')  # ✅ check if it's a voice file

            new_chat = SharedChat(
                #  cid=str(uuid.uuid4()),  # ✅ ADD THIS LINE
                sender_id=sender_id,
                receiver_id=receiver_id,
                question=question,
                answer=answer,
                type=1 if is_voice else 0,  # ✅ set type to 1 if it's .aac
                date=datetime.now().date(),
                time=datetime.now().time(),
                status=status
            )

            db.session.add(new_chat)
            added_chats.append(new_chat)

        db.session.commit()

        return jsonify({
            'message': f'{len(added_chats)} chats added successfully.',
            'chats': [chat.as_dict() for chat in added_chats]
        }), 201

    @staticmethod
    def get_chats_by_sender_id(sender_id):

        if not sender_id:
            return jsonify({'error': 'sender_id is required'}), 400

        chats = SharedChat.query.filter_by(sender_id=sender_id).all()
        return jsonify([chat.as_dict() for chat in chats]), 200

    @staticmethod
    def get_chats_by_receiver_id(receiver_id):

        if not receiver_id:
            return jsonify({'error': 'receiver_id is required'}), 400
        chats = SharedChat.query.filter_by(receiver_id=receiver_id).all()

        if not chats:
            return jsonify({'message': 'No chats found for this receiver ID'}), 404

        for chat in chats:
            chat.status = True

        db.session.commit()

        return jsonify([chat.as_dict() for chat in chats]), 200

    @staticmethod
    def update_status_by_receiver(receiver_id):
        chats = SharedChat.query.filter_by(receiver_id=receiver_id).all()
        if not chats:
            return jsonify({'message': 'No chats found for this receiver ID'}), 404

        for chat in chats:
            chat.status = True

        db.session.commit()

        return jsonify({'message': f'Status updated for {len(chats)} chats.'}), 200