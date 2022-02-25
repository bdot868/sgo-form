import React, { useState } from 'react';
import SelectField from './SelectField';
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser';
import dateFormat from "dateformat";
import { Button, Form, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const data = ["A Grave", "A Service", "An Obituary"];

const SgoForm = () => {
  //Initializing state
  const [firstname, setFirstName] = useState('');
  const [lastname, setlastName] = useState('');
  const [type, setType] = useState('');
  const [results, setResults] = useState(null);
  const [validated, setValidation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  //Setting apiType based on selection
  const _selectValue = (selectData) => {
    if (selectData === 'A Grave'){
      setType('apiGrave')
    } else if (selectData === 'A Service') {
      setType('apiService')
    } else {
      setType('apiObit')
    }
    setResults(null)
  }

  const _resetForm = () => {
    setFirstName('');
    setlastName('');
    setType('');
  }

  const sendToAzure = async () => {
    event.preventDefault()
    const checkForm = event.currentTarget;
    if (checkForm.checkValidity() !== false) {
      event.stopPropagation();
      setLoading(true);
      //sending the data to the wordpress backend to make the api call to Azure
      try {
        const form = await axios.post('http://localhost/douglassandzook.com/wp-content/themes/sdwpd-bs4/localRequest.php', {
            type: type,
            last: lastname,
            first: firstname,
          })
          //console.log('returned data:', form);
          const data = form.data;
          if(typeof data === 'string'){
            setError(true)
          } else {
            setResults(data)
          }
          setLoading(false)
      } catch (e) {
        console.log(`axios request failed: ${e}`);
        setError(true);
        setLoading(false);
      }
    } //end of form validity check

    setValidation(true);
  }


  return (
    <div className="container">
      <Form noValidate validated={validated} onSubmit={sendToAzure}>
        <div className="form-group">
          <SelectField
            label="I am looking for:"
            value={data}
            selectInfo={_selectValue}
          />
        </div>
        <div className="form-group">
          <label>First Name <span>(optional)</span></label>
          <input className="form-control" type="text" name="firstname" value={firstname} onChange={(e) => setFirstName(e.target.value)}/>
        </div>
        <div className="form-group">
          <label>Last Name<span>*</span></label>
          <input className="form-control" type="text" name="lastname" value={lastname} onChange={(e) => setlastName(e.target.value)} required/>
          <div className="invalid-feedback">
            Please provide a last name.
          </div>
        </div>

        <div className="form-group">
          <button className="btn primary-btn" type="submit">Search</button>
          <button className="btn btn-link float-right" onClick={_resetForm}>Clear Form</button>
        </div>
      </Form>

      <hr />
      {loading &&
        <Spinner animation="border" className="blue-font" role="status">
          <span className="visually-hidden"></span>
        </Spinner>
      }
      {error === true
        ? <div className="error-message"><p>An Error occurred or we were unable to complete your request please try again later.</p></div>
        : <div id="results">
            {results &&
            <div>{type === 'apiService' &&
              // Visitation
              <div>
                <div>
                  <h4>Visitation and Services Results ({results.length})</h4>
                  {results.length > 100 &&
                    <p><strong>Notice:</strong> Only the first 100 results are displayed below. If you do not see the result you are looking for below please refine your search above by adding more characters to the last and first name, and search again.</p>
                  }
                </div>
                {results.map( (user, index) => {
                  return (
                    <div className="row sgo_results  my-md-4 mx-2 mx-sm-0 mx-2 my-2 px-5 py-4">
                          <h2 className="mt-3 mb-4">{user.serviceName}</h2>
                          <div id="result_info" className="row w-100 mt-3">
                            <div className="col-6 col-sm-3 first_column">
                              <p>Service Type</p>
                              <p>Date</p>
                              <p>Time</p>
                            </div>
                            <div className="col-6 col-sm-3 second_column">
                              <p><strong>{user.service_tp}</strong></p>
                              <p><strong>{dateFormat(user.serviceDate, "mmmm dS, yyyy")}</strong></p>
                              <p><strong>{dateFormat(user.serviceStartTime, "h:MM TT")} - </strong></p>
                            </div>
                            <div className="col-12 col-sm-6 my-3 my-sm-0 third_column">
                              <p><strong>Location</strong></p>
                              <p><strong>{ReactHtmlParser(user.serviceLocation)}</strong></p>
                              <p>{user.serviceAddress}</p>
                              {/*<div>Show Map</div>*/}
                            </div>
                        </div>
                    </div>
                  )
                })}
            </div>
            }
            {type === 'apiGrave' &&
            // Grave
            <div>
              <div>
                <h4>Grave Results ({results.length})</h4>
              </div>
              {results.map( (user, index) => {
                return (
                  <div className="row sgo_results  my-md-4 mx-2 mx-sm-0 mx-2 my-2 px-5 py-4">
                    <h2 className="mt-3 mb-4">{user.name}</h2>
                    <div id="result_info" className="row w-100 mt-3">
                      <div className="col-6 col-sm-3 first_column">
                        <p><strong>Years</strong></p>
                        <p><strong>Memorial Park</strong></p>
                        <p><strong>Section</strong></p>
                      </div>
                      <div className="col-6 col-sm-3 second_column">
                        <p>{user.dob.slice(0,4)} - {user.dod.slice(0,4)}</p>
                        <p>{user.intermentPark_nm}</p>
                        <p>{user.section_nm}</p>
                      </div>
                      <div className="col-12 col-sm-6 my-3 my-sm-0 third_column">
                        <div className="notice-box">Upon arrival at our memorial park, please bring this grave location to our info booth or office and one of our representatives will provide you with a park map and directions to this grave.</div>
                        <p><strong>Location of Grave</strong></p>
                        <p><strong>Map # </strong>{user.mapNumber_cd}</p>
                        <p><strong>Lot: </strong>{user.lot_nm}</p>
                        <p><strong>Space: </strong>{user.space_nm}</p>
                        <p><strong>Property: </strong>{user.property_tp}</p>
                        <p></p>
                        {/*<div><a href="#">Show Map</a></div>*/}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            }
            {type === 'apiObit' &&
            //an Obituary
            <div>
              <h4>Obituary Results ({results.length})</h4>
              {results.length > 100 &&
                <p><strong>Notice:</strong> Only the first 100 results are displayed below. If you do not see the result you are looking for below please refine your search above by adding more characters to the last and first name, and search again.</p>
              }
              {/*<div id="obitAlert" role="alert" class="alert alert-warning mt-4">
                Obituary Not Found! Please call <a href="tel:+3233543131" target="_blank" alt="help link">323-254-3131</a> if you have any further questions.
              </div>*/}
              <div className="row my-md-4 mx-2 mx-sm-0 mx-2 my-2 px-5 py-4">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Obituary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((user, index) => {
                      return <tr id={index}>
                        <td><h4>{user.serviceName}</h4></td>
                        <td><a href={user.obitLink} target="_blank">Obituary</a></td>
                      </tr>
                    })}
                  </tbody>
                </table>
              </div>
            </div>//typeobit end
          }

            </div> //results end
          }
          </div> //error end
      }

    </div> //container end
  )
}

export default SgoForm;
