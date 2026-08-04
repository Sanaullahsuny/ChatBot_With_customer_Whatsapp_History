import os
from collections import defaultdict

import whisper
from flask import jsonify, request
from sympy import false

from Models.Category import Category
from Models.Chat import Chat
from Models.Person import Person
from Models.Session import Session
from db import db
from sqlalchemy import func
from datetime import datetime

class ChatController:
    @staticmethod
    def mark_favourite(cid):
        try:
            data = request.json
            fvalue = data["isfav"]
            chat = Chat.query.get(cid)
            if chat:
                chat.isfav = fvalue
                db.session.commit()
                return jsonify({'message': 'successfully!', 'chat': chat.as_dict()})

            else:
                return jsonify({'error': 'Chat not found'}), 404

        except Exception as e:
            return jsonify({'error': str(e)}), 500



    @staticmethod
    def get_all_chats():
        try:

            chats = Chat.query.filter_by(isDeleted=False).all()
            return jsonify([chat.as_dict() for chat in chats])
        except Exception as e:
          return jsonify({'error': f"Failed to fetch people: {str(e)}"}), 500

    @staticmethod
    def get_chat_by_id(cid):
        try:

            # Fetch the chat by ID
            chat = Chat.query.filter_by(isDeleted=False,id=cid).first()
            if chat:
                return jsonify(chat.as_dict())
            else:
                return jsonify({'error': 'Chat not found'}), 404
        except Exception as e:
            # Log the exception
            print(f"Error in get_chat_by_id: {str(e)}")
            return jsonify({'error': str(e)}), 500

    @staticmethod
    def add_chat():
        try:
            data = request.json
            time_str = data.get('time')
            parsed_time = datetime.strptime(time_str, "%H:%M:%S").time() if time_str else None

            new_chat = Chat(
                Question=data.get('question'),
                Answer=data.get('answer'),
                Time=parsed_time,
                Date=data.get('date'),
                Person_Id=data.get('person_Id'),
                Session_Id=data.get('session_Id'),
                type=data.get('type'),
                Category_id=data.get('category_id')
            )
            db.session.add(new_chat)
            db.session.commit()
            return jsonify({'message': 'Chat added successfully!', 'chat': new_chat.id}), 201
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    @staticmethod
    def save_chat(chat_obj):
        try:
            db.session.add(chat_obj)
            db.session.commit()
            return jsonify({'message': 'Chat added successfully!', 'id': chat_obj.id})
        except Exception as e:
            return jsonify({'error': str(e)})
    @staticmethod
    def update_chat(cid):
        try:
            data = request.json
            chat = Chat.query.get(cid)
            if chat:
                # Parse the Time field
                time_str = data.get('time')
                parsed_time = datetime.strptime(time_str, "%H:%M:%S").time() if time_str else chat.Time

                chat.Question = data.get('question', chat.Question)
                chat.Answer = data.get('answer', chat.Answer)
                chat.Time = parsed_time
                chat.Date = data.get('date', chat.Date)
                chat.Person_Id = data.get('person_Id', chat.Person_Id)
                chat.Session_Id = data.get('session_Id', chat.Session_Id)

                chat.Category_id = data.get('category_id', chat.Category_id)
                db.session.commit()
                return jsonify({'message': 'Chat updated successfully!', 'chat': chat.as_dict()})
            else:
                return jsonify({'error': 'Chat not found'}), 404
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @staticmethod
    def delete_chat(cid):
        try:
            chat = Chat.query.filter_by(isDeleted=False, id=cid).first()

            if chat:
                print("Before:", chat.isDeleted)  # 👈 Debug print
                chat.isDeleted = True  # <-- Important line
                db.session.commit()
                print("After:", chat.isDeleted)  # 👈 Debug print
                return jsonify({'message': 'Chat deleted successfully!'})
            else:
                return jsonify({'error': 'Chat not found'}), 404
        except Exception as e:
            db.session.rollback()  # <-- for safety
            return jsonify({'error': str(e)}), 500


    @staticmethod
    def get_chats_by_person(person_id):
        try:
            chats = Chat.query.filter_by(Person_Id=person_id,isDeleted=False).all()
            return jsonify([chat.as_dict() for chat in chats])
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @staticmethod
    def count_chats_by_person(person_id):
        try:
            total_chats = Chat.query.filter_by(Person_Id=person_id,isDeleted=False).count()
            return jsonify({'person_id': person_id, 'total_chats': total_chats})
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @staticmethod
    def count_chats_by_program(program_id):
        try:

            total_chats = Chat.query.filter_by(Program_Id=program_id,isDeleted=False).count()
            return jsonify({'program_id': program_id, 'total_chats': total_chats})
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @staticmethod
    def count_chats_by_session(session_id):
        try:
            total_chats = Chat.query.filter_by(Session_Id=session_id,isDeleted=False).count()
            return jsonify({'session_id': session_id, 'total_chats': total_chats})
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @staticmethod
    def count_chats_by_category(category_id):
        try:
            total_chats = Chat.query.filter_by(Category_id=category_id,isDeleted=False).count()
            return jsonify({'category_id': category_id, 'total_chats': total_chats})
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @staticmethod
    def get_chats_by_session(session_id):
        try:
            chats = Chat.query.filter_by(Session_Id=session_id).all()
            return jsonify([chat.as_dict() for chat in chats])
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @staticmethod
    def get_chats_by_program(program_id):
        try:
            chats = Chat.query.filter_by(Program_Id=program_id).all()
            return jsonify([chat.as_dict() for chat in chats])
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @staticmethod
    def get_chats_by_category(category_id):
        try:
            chats = Chat.query.filter_by(Category_id=category_id).all()
            return jsonify([chat.as_dict() for chat in chats])
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @staticmethod
    def count_chats_by_session_title(session_title):
        try:
            total_chats = Chat.query.join(Session).filter(Session.title == session_title,Chat.isDeleted==False).count()
            return jsonify({'session_title': session_title, 'total_chats': total_chats})
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @staticmethod
    def get_chats_of_all_persons_by_session_title(session_title):
        try:
            chats = Chat.query.join(Session).filter(Session.title == session_title).all()
            return jsonify([chat.as_dict() for chat in chats])
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @staticmethod
    def categoryreport():
        try:
            # Query to count chats grouped by Category_id and include the category title
            category_counts = db.session.query(
                Chat.Category_id,
                func.count(Chat.id).label('total_chats'),
                Category.title
            ).join(Category).group_by(Chat.Category_id, Category.title).all()

            # Prepare the response
            return jsonify([{
                'category_id': category_id,
                'category_title': title,
                'total_chats': total_chats
            } for category_id, total_chats, title in category_counts])

        except Exception as e:
            return jsonify({'error': str(e)}), 500
    #
    # @staticmethod
    # def categoryreportbyprogram(program_title):
    #     try:
    #         # Query to count chats grouped by Category_id and include the category title
    #         category_counts = db.session.query(
    #             Chat.Category_id,
    #             func.count(Chat.id).label('total_chats'),  # Use Chat.id if that's the correct field for counting
    #             Category.title
    #         ).join(Category).join(Program).filter(Program.name == program_title).group_by(Chat.Category_id,
    #                                                                                        Category.title).all()
    #
    #         # Prepare the response
    #         return jsonify([{
    #             'category_id': category_id,
    #             'category_title': title,
    #             'total_chats': total_chats
    #         } for category_id, total_chats, title in category_counts])
    #
    #     except Exception as e:
    #         return jsonify({'error': str(e)}), 500
    #
    @staticmethod
    def sessionreport():
        try:
            session_counts = db.session.query(Chat.Session_Id, func.count(Chat.id), Session.title).join(
                Session).group_by(Chat.Session_Id, Session.title).all()

            return jsonify(
                [{'session_id': session_id, 'session_title': title, 'total_chats': count} for session_id, count, title
                 in session_counts])
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    # @staticmethod
    # def sessionreportbyprogram(program_title):
    #     try:
    #         print(f"Searching for program: {program_title}")
    #         session_counts = db.session.query(Chat.Session_Id, func.count(Chat.id), Session.title).join(
    #             Session).join(Program).filter(Program.name == program_title).group_by(Chat.Session_Id,
    #                                                                                   Session.title).all()
    #
    #         if not session_counts:
    #             print("No sessions found for this program.")
    #
    #         return jsonify(
    #             [
    #                 {'session_id': session_id, 'session_title': title, 'total_chats': count}
    #                 for session_id, count, title
    #                 in session_counts
    #             ])
    #     except Exception as e:
    #         return jsonify({'error': str(e)}), 500
    #
    # # Additional Useful Actions

    @staticmethod
    def get_chat_summary():
        try:
            summary = db.session.query(
                func.count(Chat.id).label('total_chats'),
                func.count(func.distinct(Chat.Person_Id)).label('total_persons'),
                func.count(func.distinct(Chat.Session_Id)).label('total_sessions'),
                func.count(func.distinct(Chat.Program_Id)).label('total_programs'),
                func.count(func.distinct(Chat.Category_id)).label('total_categories')
            ).first()
            return jsonify({
                'total_chats': summary.total_chats,
                'total_persons': summary.total_persons,
                'total_sessions': summary.total_sessions,
                'total_programs': summary.total_programs,
                'total_categories': summary.total_categories
            })
        except Exception as e:
            return jsonify({'error': str(e)}), 500



    @staticmethod
    def get_chats_by_date_range(start_date, end_date):
        try:
            # Convert string dates to datetime objects if necessary
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date() if isinstance(start_date, str) else start_date
            end_date = datetime.strptime(end_date, '%Y-%m-%d').date() if isinstance(end_date, str) else end_date

            # Query the database for chats within the given date range
            chats = Chat.query.filter(Chat.Date >= start_date, Chat.Date <= end_date,Chat.isDeleted==False).all()

            # Return the result as JSON
            return jsonify([chat.as_dict() for chat in chats])
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @staticmethod
    def categoryCount():
        try:
            # LEFT OUTER JOIN Category -> Chat
            category_counts = db.session.query(
                Category.id.label('category_id'),
                Category.title.label('category_title'),
                func.coalesce(func.count(Chat.id), 0).label('total_chats')
            ).outerjoin(Chat, Chat.Category_id == Category.id) \
                .filter(Category.isDeleted == False) \
                .group_by(Category.id, Category.title) \
                .order_by(Category.id) \
                .all()

            return jsonify([
                {
                    'category_id': category_id,
                    'category_title': category_title,
                    'total_chats': total_chats
                }
                for category_id, category_title, total_chats in category_counts
            ])

        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @staticmethod
    def category_report_by_session(sid):
        try:
            # Query to count chats grouped by Category_id and include the category title, filtered by session id
            category_counts = db.session.query(
                Chat.Category_id,
                func.count(Chat.id).label('total_chats'),
                func.sum(Chat.isfav).label('total_sum'),
                Category.title
            ).join(Category).filter(Chat.Session_Id == sid).group_by(Chat.Category_id, Category.title).all()

            # Prepare the response in the expected format
            return jsonify([{
                'category_id': category_id,
                'category_title': title,
                'total_chats': total_chats,
                'avg_rate':total_sum/total_chats
            } for category_id, total_chats, total_sum,title in category_counts])

        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @staticmethod
    def category_report_with_chat(sid):
        try:
            # Step 1: Get category-wise chat count
            category_counts = db.session.query(
                Chat.Category_id,
                func.count(Chat.id).label('total_chats'),
                Category.title
            ).join(Category).filter(Chat.Session_Id == sid).group_by(Chat.Category_id, Category.title).all()

            result = []

            for category_id, total_chats, title in category_counts:
                chats = db.session.query(Chat).filter(
                    Chat.Session_Id == sid,
                    Chat.Category_id == category_id
                ).all()

                chat_list = [chat.as_dict() for chat in chats]

                result.append({
                    'category_id': category_id,
                    'category_title': title,
                    'total_chats': total_chats,
                    'chats': chat_list
                })

            return jsonify(result)

        except Exception as e:
          return jsonify({'error': str(e)}), 500

    @staticmethod
    def get_chats_category_report_session(session_id):
        try:
            data = request.json
            category_id = data["category_id"]
            chats = Chat.query.filter_by(Category_id=category_id, Session_Id=session_id).order_by(Chat.isfav.desc()).all()
            return jsonify([chat.as_dict() for chat in chats])
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @staticmethod
    def get_chats_by_person_grouped(person_id):
        try:
            chats = Chat.query.filter_by(Person_Id=person_id, isDeleted=False).order_by(Chat.Date.desc(),
                                                                                        Chat.Time.asc()).all()

            grouped_chats = defaultdict(list)

            for chat in chats:
                date_key = chat.Date.strftime("%Y-%m-%d")
                grouped_chats[date_key].append(chat.as_dict())

            return jsonify(dict(grouped_chats))

        except Exception as e:


            return jsonify({'error': str(e)}), 500

    @staticmethod
    def fetch_phonenumbers():
        current_session = Session.query.filter_by(isActive=True).first()

        if not current_session:
            return []

        result = (
            db.session.query(Person.Phno)
            .join(Chat, Person.id == Chat.Person_Id)
            .filter(Person.isDeleted == False)
            .filter(Chat.Session_Id == current_session.id)
            .distinct()
            .all()
        )

        phone_numbers = [row[0] for row in result]
        return phone_numbers

    @staticmethod
    def fetch_session_user():
        current_session = Session.query.filter_by(isActive=True).first()

        if not current_session:
            return jsonify([])

        result = (
            db.session.query(Person)
            .join(Chat, Person.id == Chat.Person_Id)
            .filter(Person.isDeleted == False)
            .filter(Chat.Session_Id == current_session.id)
            .distinct()
            .all()
        )

        persons_data = [person.as_dict() for person in result]
        return jsonify(persons_data)

    @staticmethod
    def get_chats_by_person_with_transcribe(person_id):
        try:
            chats = Chat.query.filter_by(Person_Id=person_id, isDeleted=False).all()
            chat_list = []

            for chat in chats:
                chat_dict = chat.as_dict()

                if chat.type == 1:
                    question_path = '/Users/Malik/PycharmProjects/PythonProject1/Uploads/UserQueries/'+chat.Question
                    answer_path =  "/Users/Malik/PycharmProjects/PythonProject1/Uploads/ModelAnswers/"+chat.Answer

                    chat_dict["TranscribedQuestion"] = ChatController.transcribe(question_path) if os.path.exists(
                        question_path) else "File not found"
                    chat_dict["TranscribedAnswer"] = ChatController.transcribe(answer_path) if os.path.exists(
                        answer_path) else "File not found"
                else:
                    # For non-type 1, just return null for those fields
                    chat_dict["TranscribedQuestion"] = None
                    chat_dict["TranscribedAnswer"] = None

                chat_list.append(chat_dict)

            return jsonify(chat_list)

        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @staticmethod
    def transcribe(aac_file_path):
        try:
            print(f"Transcribing: {aac_file_path}")
            model = whisper.load_model("tiny")
            result = model.transcribe(aac_file_path)
            return result["text"]
        except Exception as e:
            print(f"Transcription failed: {e}")
            return None

    def save_user_reply(cid):
        try:
            data=request.json
            user_reply=data["user_reply"]
            chat=Chat.query.get(cid)
            if chat:
                chat.userreply=user_reply
                db.session.commit()
                return  jsonify({'message':'sucsessfully user feadback is saved'})


            else:
                return jsonify({'error':'Chat noy Found'}),404


        except Exception as e:
             return jsonify({'error':str(e)}),500


    @staticmethod
    def get_user_reply():
        try:

            chats = Chat.query.filter_by(isDeleted=False).all()
            return jsonify([chat.as_dict() for chat in chats])


        except Exception as e:
            return jsonify({'error': f'Failed to fetch people : {str(e)}'}), 500


