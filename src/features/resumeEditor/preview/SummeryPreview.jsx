import React from 'react'

function SummeryPreview({ resumeInfo }) {
  return (
    <p className='text-js'>
        {resumeInfo?.summary || "Professional summary goes here. This is a brief overview of your skills, experience, and career goals."}
    </p>
  )
}

export default SummeryPreview