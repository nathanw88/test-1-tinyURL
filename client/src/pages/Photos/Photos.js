import React from "react";
import axios from "axios";
import { Jumbotron } from 'reactstrap';
class Photos extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      title: "",
      caption: "",
      imageUrl: ""
    };
  }
  componentDidMount() {
    axios.get(`/api/photos/photo/${this.props.match.params.id}`).then(res => {
      console.log(res)
      const{title, caption, imageUrl} = res.data[0]
      this.setState({
        title, caption, imageUrl
      });

    });
    console.log(this.state)
  }

  render() {

    return (
      
      <Jumbotron style = "margins = auto">
      <h1>{this.state.title}</h1>
      <img src={this.state.imageUrl} alt={this.state.title} width="500" height="600"/>
      <figcaption>{this.state.caption}</figcaption>
      </Jumbotron>
    );

  }
}


export default Photos