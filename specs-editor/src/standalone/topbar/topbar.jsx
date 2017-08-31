import React, { PropTypes } from "react"
import Swagger from "swagger-client"
import "whatwg-fetch"
import DropdownMenu from "./DropdownMenu"
import Modal from "boron/DropModal"
import downloadFile from "react-file-download"
import YAML from "js-yaml"
import beautifyJson from "json-beautify"
import URLSearchParams from "url-search-params"

import "react-dd-menu/dist/react-dd-menu.css"
import "./topbar.less"
import Logo from "./logo_small.png"

export default class Topbar extends React.Component {
  constructor(props, context) {
    super(props, context)
    Swagger("https://generator.swagger.io/api/swagger.json", {
      requestInterceptor: (req) => {
        req.headers["Accept"] = "application/json"
        req.headers["content-type"] = "application/json"
      }
    })
      .then(client => {
        this.setState({ swaggerClient: client })
        client.apis.clients.clientOptions()
          .then(res => {
            this.setState({ clients: res.body })
          })
        client.apis.servers.serverOptions()
          .then(res => {
            this.setState({ servers: res.body })
          })
      })

    this.state = {
      swaggerClient: null,
      clients: [],
      servers: []
    }
  }

  // Menu actions: import From CURL request
  specsFromCURL = () => {
    let curl = this.refs.textInputCURL.value
    if (curl) {
      let params = {
        type: "CURL",
        data: curl
      }
      const searchParams = new URLSearchParams()
      for (const prop in params) {
        searchParams.set(prop, params[prop])
      }
      fetch("/generate", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: searchParams
      })
        .then(res => res.text())
        .then(text => {
          this.props.specActions.updateSpec(
            YAML.safeDump(YAML.safeLoad(text))
          )
        })
    }
    this.hideModalCURL()
  }

  importFromFile = () => {
    let fileToLoad = this.refs.fileLoadInput.files.item(0)
    let fileReader = new FileReader()

    fileReader.onload = fileLoadedEvent => {
      let textFromFileLoaded = fileLoadedEvent.target.result
      this.props.specActions.updateSpec(YAML.safeDump(YAML.safeLoad(textFromFileLoaded)))
      this.hideModalFile()
    }

    fileReader.readAsText(fileToLoad, "UTF-8")
  }

  saveAsYaml = () => {
    // Editor content -> JS object -> YAML string
    let editorContent = this.props.specSelectors.specStr()
    let jsContent = YAML.safeLoad(editorContent)
    let yamlContent = YAML.safeDump(jsContent)
    downloadFile(yamlContent, "swagger.yaml")
  }

  saveAsJson = () => {
    // Editor content  -> JS object -> Pretty JSON string
    let editorContent = this.props.specSelectors.specStr()
    let jsContent = YAML.safeLoad(editorContent)
    let prettyJsonContent = beautifyJson(jsContent, null, 2)
    downloadFile(prettyJsonContent, "swagger.json")
  }

  saveAsText = () => {
    // Download raw text content
    let editorContent = this.props.specSelectors.specStr()
    downloadFile(editorContent, "swagger.txt")
  }

  convertToYaml = () => {
    // Editor content -> JS object -> YAML string
    let editorContent = this.props.specSelectors.specStr()
    let jsContent = YAML.safeLoad(editorContent)
    let yamlContent = YAML.safeDump(jsContent)
    this.props.specActions.updateSpec(yamlContent)
  }

  downloadGeneratedFile = (type, name) => {
    let { specSelectors } = this.props
    let swaggerClient = this.state.swaggerClient
    if (!swaggerClient) {
      // Swagger client isn"t ready yet.
      return
    }
    if (type === "server") {
      swaggerClient.apis.servers.generateServerForLanguage({
        framework: name,
        body: JSON.stringify({
          spec: specSelectors.specResolved()
        }),
        headers: JSON.stringify({
          Accept: "application/json"
        })
      })
        .then(res => handleResponse(res))
    }

    if (type === "client") {
      swaggerClient.apis.clients.generateClient({
        language: name,
        body: JSON.stringify({
          spec: specSelectors.specResolved()
        })
      })
        .then(res => handleResponse(res))
    }

    function handleResponse(res) {
      if (!res.ok) {
        return console.error(res)
      }

      fetch(res.body.link)
        .then(res => res.blob())
        .then(res => {
          downloadFile(res, `${name}-${type}-generated.zip`)
        })
    }

  }

  clearEditor = () => {
    if (window.localStorage) {
      window.localStorage.removeItem("swagger-editor-content")
      this.props.specActions.updateSpec("")
    }
  }

  // Helpers

  showModalFile = () => {
    this.refs.modalFile.show()
  }

  hideModalFile = () => {
    this.refs.modalFile.hide()
  }

  showModalCURL = () => {
    this.refs.modalCURL.show()
  }

  hideModalCURL = () => {
    this.refs.modalCURL.hide()
  }

  render() {
    let { getComponent } = this.props
    const Link = getComponent("Link")

    let makeMenuOptions = (name) => {
      let stateKey = `is${name}MenuOpen`
      let toggleFn = () => this.setState({ [stateKey]: !this.state[stateKey] })
      return {
        isOpen: !!this.state[stateKey],
        close: () => this.setState({ [stateKey]: false }),
        align: "left",
        toggle: <span className="menu-item" onClick={toggleFn}>{name}</span>
      }
    }

    return (
      <div>
        <div className="topbar">
          <div className="topbar-wrapper">
            <Link href="#">
              <img height="30" width="30" className="topbar-logo__img" src={Logo} alt="" />
              <span className="topbar-logo__title">OpenGate IO</span>
            </Link>
            <DropdownMenu {...makeMenuOptions("File") }>
              <li><button type="button" onClick={this.showModalCURL}>Import CURL</button></li>
              <li><button type="button" onClick={this.showModalFile}>Import File</button></li>
              <li role="separator"></li>
              <li><button type="button" onClick={this.saveAsYaml}>Download YAML</button></li>
              <li><button type="button" onClick={this.saveAsJson}>Download JSON</button></li>
              <li role="separator"></li>
              <li><button type="button" onClick={this.clearEditor}>Clear editor</button></li>
            </DropdownMenu>
            <DropdownMenu {...makeMenuOptions("Edit") }>
              <li><button type="button" onClick={this.convertToYaml}>Convert to YAML</button></li>
            </DropdownMenu>
          </div>
        </div>
        <Modal className="swagger-ui modal" ref="modalFile">
          <div className="container">
            <h2>Upload file</h2>
            <input type="file" ref="fileLoadInput"></input>
          </div>
          <div className="right">
            <button className="btn cancel" onClick={this.hideModalFile}>Cancel</button>
            <button className="btn" onClick={this.importFromFile}>Open file</button>
          </div>
        </Modal>
        <Modal className="swagger-ui modal" ref="modalCURL">
          <div className="container">
            <h2>Import From CURL</h2>
            <textarea type="input" ref="textInputCURL" style={{ "border": "1px solid #c3c3c3" }}></textarea>
          </div>
          <div className="right">
            <button className="btn cancel" onClick={this.hideModalCURL}>Cancel</button>
            <button className="btn" onClick={this.specsFromCURL}>Import</button>
          </div>
        </Modal>
      </div>

    )
  }
}

Topbar.propTypes = {
  specSelectors: PropTypes.object.isRequired,
  specActions: PropTypes.object.isRequired,
  getComponent: PropTypes.func.isRequired
}
