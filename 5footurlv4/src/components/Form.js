import React from "react";
import { nanoid } from 'nanoid';
import { getDatabase, child, ref, set, get } from "firebase/database";
import { isWebUri } from 'valid-url';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

class Form extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            longURL: '',
            preferredAlias: '',
            generatedURL: '',
            loading: false,
            errors: [],
            errorMessage: {},
            toolTipMessage: 'Copy to Clipboard'

        };
    }

    onSubmit = async (event) => {
        event.preventDefault();
        this.setState({
            loading: true,
            generatedURL: ''
        })

        var isFormValid = await this.validateInput()
        if(!isFormValid) {
            return
        }

        var generatedKey = nanoid(5);
        var generatedURL = "fivefooturl.onrender.com/" + this.state.preferredAlias

        if (this.state.preferredAlias !== ''){
            generatedKey = this.state.preferredAlias
            generatedURL = "fivefooturl.onrender.com/" + this.state.preferredAlias
        }

        const db = getDatabase();
        set(ref(db, '/' + generatedKey), {
            generatedKey: generatedKey, 
            longURL: this.state.longURL,
            preferredAlias: this.state.preferredAlias,
            generatedURL: generatedURL

        }).then ((result) =>{
            this.setState({
                generatedURL: generatedURL,
                loading: false
            })
        }).catch((e) => {

        })
    }

    hasError = (key) => {
        return this.state.errors.indexOf(key) !== -1;
    }

    handleChange = (e) => {
        const { id, value } = e.target
        this.setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    }

    validateInput = async () => {
        var errors = [];
        var errorMessages = this.state.errorMessage

        if(this.state.longURL.length === 0){
            errors.push("longURL");
            errorMessages['longURL'] = 'Please enter your URL!';
        } else if( !isWebUri(this.state.longURL)){
            errors.push("longURL");
            errorMessages['longURL'] = 'Please input a URL in the form of https:/www...';
    
        }

        if(this.state.preferredAlias !== ''){
            if(this.state.preferredAlias.length > 7) {
                errors.push("suggestedAlias");
                errorMessages['suggestedAlias'] = 'Please enter an alias less than 7 characters.';
            } else if (this.state.preferredAlias.indexOf(' ') >= 0) {
                errors.push("suggestedAlias");
                errorMessages['suggestedAlias'] = 'Spaces are not allowed in URLs';
            }

            var keyExists = await this.checkKeyExists()

            if (keyExists.exists()){
                errors.push("suggestedAlias");
                errorMessages['suggestedAlias'] = 'The alias you entered already exists. Please enter another.';
            }
        }
        this.setState({
            errors: errors,
            errorMessages: errorMessages,
            loading: false
        });

        if (errors.length > 0) {
            return false;
        }

        return true;
    }
    
    checkKeyExists = async () => {
        const dbRef = ref(getDatabase());
        return get(child(dbRef, `/${this.state.preferredAlias}`)).catch((error) => {
            return false;
        });
    }

    copyToClipBoard = () => {
        navigator.clipboard.writeText(this.state.generatedURL)
        this.setState({
            toolTipMessage: 'Copied!'
        })
    }

    render() {
        return (
            <div className="container">
                <form autoComplete="off">
                    <h3>5footURL!</h3>

                    <div className="form-group">
                        <label>Enter your long URL</label>
                        <input
                            id="longURL"
                            onChange={this.handleChange}
                            value={this.state.longURL}
                            type="url"
                            required
                            className={
                                this.hasError("longURL")
                                    ? "form-control is-invalid"
                                    : "form-control"
                            }
                            placeholder="https://www...">
                        </input>
                    </div>
                    <div
                        className={
                            this.hasError("longURL") ? "text-danger" : "visually-hidden"
                        }>
                        {this.state.errorMessage.longURL}
                    </div>

                    <div className="form-group">
                        <label htmlFor="basic-url">Your 5footURL</label>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text">fivefooturl.onrender.com/</span>

                            </div>
                            <input
                                id="preferredAlias"
                                onChange={this.handleChange}
                                value={this.state.preferredAlias}
                                className={
                                    this.hasError("preferredAlias")
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                type="text" placeholder="ex. 85gw60 (Optional)"
                                >
                            </input>
                        </div>
                        <div
                            className={
                                this.hasError("suggestedAlias") ? "text-danger" : "visually-hidden"
                            }>
                            {this.state.errorMessage.suggestedAlias}
                        </div>
                    </div>

                    <button className="btn btn-primary" type="button" onClick={this.onSubmit}>
                        {
                            this.state.loading ?
                            <div>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            </div> :
                            <div>
                                <span className="visually-hidden spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                <span>5footURL</span>
                            </div>
                        }

                    </button>

                    {
                        this.state.generatedURL === '' ?
                            <div></div>
                            :
                            <div className="generatedURL">
                                <span>Your generated URL is: </span>
                                <div className="input-group mb-3">
                                    <input disabled type="text" value={this.state.generatedURL} 
                                    className="form-control" 
                                    placeholder="Recipient's username"
                                    aria-label="Recipient's username"/>
                                <div className="input-group-append">
                                    <OverlayTrigger
                                        key={'top'}
                                        placement={'top'}
                                        overlay={
                                            <Tooltip id={`tooltip-${'top'}`}>
                                                {this.state.toolTipMessage}
                                            </Tooltip>
                                        }
                                    >
                                        <button
                                            onclick={() => this.copyToClipBoard()} data-toggle="tooltip"
                                            data-placement="top" title="Tooltip on top" className="btn btn-outline-secondary"
                                            type="button">
                                            Copy
                                        </button>
                                    </OverlayTrigger>
                                </div>
                                </div>

                            </div>
                    }
                </form>
            </div>
        )
    }
}

export default Form;