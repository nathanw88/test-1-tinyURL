import React from "react";
import axios from "axios";
import { Jumbotron } from 'reactstrap';
import DocumentMeta from 'react-document-meta';
import "./Photos.css"

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
      const { title, caption, imageUrl } = res.data[0]
      this.setState({
        title, caption, imageUrl
      });

    });
    console.log(this.state)
  }

  render() {

    const meta = {
      title: this.state.title,
      description: this.state.caption,
      meta: {
        charset: 'utf-8',
        type: "image",
        image: this.state.imageUrl
      }
    };

    return (
      <DocumentMeta {...meta}>
        <div id="mainContainer">
          <Jumbotron id="flowerContainer" >
            <h1>{this.state.title}</h1>
            <img src={this.state.imageUrl} alt={this.state.title} />
            <figcaption>{this.state.caption}</figcaption>
          </Jumbotron>
        </div>

      </DocumentMeta>
    );

  }
}


export default Photos