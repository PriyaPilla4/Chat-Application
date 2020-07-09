import os, json

from flask import Flask, render_template, jsonify, request, session, redirect, url_for, escape
from flask_socketio import SocketIO, emit, join_room, leave_room

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

global list_of_channels
list_of_channels = []

global messages
messages = []

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/displayname", methods=["POST"])
def displayname():
    global displayname
    displayname = request.form.get("displayname")
    print(f"{displayname}")
    return jsonify({"displayname": displayname})

@app.route("/channel_list", methods=["POST"])
def channel_list():
    return render_template("channel_list.html", displayname=displayname, list_of_channels=list_of_channels)

@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    send(username + ' has left the room.', room=room)

@app.route("/channel", methods=["POST", "GET"])
def channel():

    global channel
    
    channel = request.form.get("channel")
    if channel is None:
        channel = request.form.get("channel_from_list")
    else:
        for channel_ in list_of_channels:
            if channel_ == channel:
                
                return render_template("error.html", displayname=displayname, message="This channel already exists.")
            else:
                pass
        else:
            list_of_channels.append(channel)

    return render_template("channel.html", displayname=displayname, channel=channel)


def messageReceived(methods=['GET', 'POST']):
    print('message was received!!!')

@socketio.on('my event')
def handle_my_custom_event(json, methods=['GET', 'POST']):
    print('received my event: ' + str(json))
    room = json.get("channel")
    join_room(room)

    if json.get("data") is None:
        messages.append(json)
        if len(messages) > 100: #makes sure to only show 100 most recent message when new user connects
            messages.pop(0)

        print(f"{messages}")
    else:
        for message in messages:
            if room == message.get("channel"):
                emit('my response', message, broadcast=False)
        else:
            pass
    
    print(f"here")
    return socketio.emit('my response', json, room=room, callback=messageReceived)
    

if __name__ == '__main__':
    socketio.run(app)