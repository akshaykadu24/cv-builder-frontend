import React from 'react'

const FieldValidate = ({ fieldValue, fieldName, propFunction }) => {
    console.log(fieldValue)
    return (
        <>
            {
                fieldValue !== undefined && (fieldValue?.trim().length > 0
                    ? (fieldName == "Email" ? (!propFunction(fieldValue)
                        ? <div style={{ color: "red", fontSize: "13px", textAlign: 'left' }}>{`Please enter a valid email address`}</div>

                        : null
                    )
                        :
                        //all other fields except email field which is not empty and return null and showing nothing error
                        null
                    )
                    :
                    (<div style={{ color: "red", fontSize: "13px", textAlign: 'left' }}>{`${fieldName} field is required`}</div>)
                )



            }

        </>
    )
}

export default FieldValidate