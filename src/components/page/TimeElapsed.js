import { useEffect, useState } from "react";

function TimeElapsed({ created }) {
  const [timeValue, setTimeValue] = useState(null);
  const [timeType, setTimeType] = useState(null);

  useEffect(() => {
    const clientDate = new Date();
    const creationDate = created.toDate();
    if(-(clientDate.getDay() - creationDate.getDay()) < 1) {
      if(-(clientDate.getHours() - creationDate.getHours()) < 1) {
        setTimeValue((clientDate.getMinutes() - creationDate.getMinutes()));
        setTimeType('minutes');
      } else {
        setTimeValue((clientDate.getHours() - creationDate.getHours()));
        setTimeType('hours');
      }
    } else {
      setTimeValue(-(clientDate.getDay() - creationDate.getDay()));
      setTimeType('days');
    }
  }, [created])

  return <div className="time-container">
    {timeValue !== null && timeType !== null ? <div style={{color: 'gray'}}>{`${timeValue} ${timeType} ago`}</div>: null}
  </div>
}

export { TimeElapsed };