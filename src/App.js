import React, { Component ,createRef} from "react";
import JitsiMeetJS from "@lyno/lib-jitsi-meet";
import {
  connect,
  createAndJoinRoom,
  createTracksAndAddToRoom
} from "./utils/jitsiUtils";
export default class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      videoTracks: [],
      audioTracks: []
    };
    this.videoTracks = React.createRef([]);
    this.addTrack = this.addTrack.bind(this)
    this.connect = this.connect.bind(this)
  }
  

  static propTypes = {};
  static defaultProps = {};

  addTrack(track) {
    console.log("addtrack")
    if (track.getType() === "video") {
      // this.setState(prevState => ({
      //     videoTracks:[...prevState.videoTracks,...track]
      // }))
      console.log("video")
      this.state.videoTracks.concat(track);
      this.videoRefs.current[this.videoRefs.current.length() - 1].current.srcObject =
        track.stream;
      // track.attach(this.$refs[track.getId()][0]);
    } else if (track.getType() === "audio") {
    //   this.setState(prevState => ({
    //     audioTracks:[...prevState.audioTracks,...track]
    // }))
    console.log("audioo")
      this.state.audioTracks.push(track);
      // track.attach(this.$refs[track.getId()][0]);
    }

    // this.$nextTick().then(() => {
    //   track.attach(this.$refs[track.getId()][0]);
    // });
    if (this.videoRefs.current.length() !== this.state.videoTracks.length()) {
      this.videoRefs.current = Array(this.state.videoTracks.length())
        .fill()
        .map((_, i) => this.videoRefs.current[i] || createRef());
  }
  }

  connect() {
    const roomName = "my-secret-conference";
    connect(roomName)
      .then(connection => {
        return createAndJoinRoom(connection, roomName);
      })
      .then(room => {
        console.log("HERE",room )
        room.on(JitsiMeetJS.events.conference.TRACK_ADDED, track =>{

          this.addTrack(track)
        }
          
        );
        createTracksAndAddToRoom(room);
      })
      .catch(error => console.error(error));
  }

  render() {
    const { connect } = this;
    return (
      <div id="app">
        <h1>Performance</h1>
        <button onClick={connect}>Connect</button>
        {this.state.videoTracks.map(track => (
          <span>Hi</span>
          // <video autoplay="1" key={`track-${track.getId()}`}></video>
        ))}
        {this.state.audioTracks.map(track => (
          <audio autoplay="1" key={`track-${track.getId()}`}></audio>
        ))}
      </div>
    );
  }
}
