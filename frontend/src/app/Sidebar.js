'use client'
import Link from "next/link"
function Sidebar(){
    return(
        <div id="sidebar">
            <div className="sbarcont">
                <div className="sbarelement"><Link href="/" className='slink'><div className='ico'><img src='/assets/images/dash.svg'></img><div className='sbart'> Data Summary</div></div></Link></div>
                <div className="sbarelement"><Link href="/eda" className='slink'><div className='ico'><img src='/assets/images/eda.svg'></img><div className='sbart'> Exploratory Data Analysis</div></div></Link></div>
                <div className="sbarelement"><Link href="/tests" className='slink'><div className='ico'><img src='/assets/images/tests.svg'></img><div className='sbart'> Statistical Tests</div></div></Link></div>
                <div className="sbarelement"><Link href="/about" className='slink'><div className='ico'><img src='/assets/images/info.svg'></img><div className='sbart'> About</div></div></Link></div>
            </div>
        </div>
    )
}
export default Sidebar