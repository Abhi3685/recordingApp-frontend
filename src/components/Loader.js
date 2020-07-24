import React from 'react'

import loader from '../assets/images/loader.gif';
import { loaderContainerClasses } from '../utils/classes';

function Loader({ loading }) {
  return (
    loading && <div className={loaderContainerClasses} style={{ opacity: 0.98 }}>
      <img src={loader} alt="" className="w-full md:w-8/12" />
    </div>
  )
}

export default Loader;
