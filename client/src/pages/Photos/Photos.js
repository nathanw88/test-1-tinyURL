import React from "react";
import axios from "axios";
import { Jumbotron } from 'reactstrap';
import DocumentMeta from 'react-document-meta';
import "./Photos.css"
import Imgix from "react-imgix";


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
    //grab photo just uploaded by id
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
    //setting open graph metadata
    const meta = {
      meta: {
        property: {
          "og:title": this.state.title,
          "og:description": this.state.caption,
          "og:image": this.state.imageUrl,
          "og:type": "image",
          "og:url": window.location.pathname
        },
      }
    };

    return (
      <DocumentMeta {...meta}>
        <div id="mainContainer">
          <a href="/">
            <img id="logo" src={require("../../images/logo.png")} alt="Logo" />
          </a>
          <Jumbotron id="midContainer" >
            <h1>{this.state.title}</h1>
            <div className="imageContainer">
              <Imgix src={this.state.imageUrl} alt={this.state.title} sizes="calc(80% - 8px)" />
            </div>
            <figcaption>{this.state.caption}</figcaption>
          </Jumbotron>
        </div>

      </DocumentMeta>
    );

  }
}


export default Photos