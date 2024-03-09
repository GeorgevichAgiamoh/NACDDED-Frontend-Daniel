import { PersonOutline, FilterOutlined, SortOutlined, SearchOutlined, ListAltOutlined, CloudDownloadOutlined, ArrowBack, ArrowForward, MoreVert, Close, Add, KeyboardArrowDown, SavingsOutlined, MonetizationOnOutlined, ListOutlined } from "@mui/icons-material"
import { useState, useEffect } from "react"
import useWindowDimensions from "../../../../helper/dimension"
import { myEles, setTitle, appName, Mgin, Btn, LrText, IconBtn, Line, icony, ErrorCont, hexToRgba } from "../../../../helper/general"
import { payTypeEle } from "../../../classes/classes"
import Barcode from "react-barcode"
import { payRecordEle, payStat } from "../../../classes/models"
import { CircularProgress } from "@mui/material"
import Toast from "../../../toast/toast"
import { makeRequest, resHandler } from "../../../../helper/requesthandler"
import { useLocation, useNavigate } from "react-router-dom"
import { PoweredBySSS } from "../../../../helper/nacdded"
import tabcard from "../../../../assets/tabcard.png"



export function PaymentList(mainprop:{payType:payTypeEle, backy:()=>void}){
    const location = useLocation()
    const navigate = useNavigate()
    const dimen = useWindowDimensions()
    const mye = new myEles(false)
    const[search, setSearch] = useState('')
    const[showPaid, setShowPaid] = useState(true)
    const[showSearch, setShowSearch] = useState(false)
    const[cpay, setCPay] = useState<payRecordEle>()
    const[showReminder, setShowReminder] = useState(false)
    const[showReceipt, setShowReceipt] = useState(false)
    const myKey = Date.now()
    const[optToShow,setOptToShow] = useState(-1)
    const[showingIndex,setShowingIndex] = useState(0)
    const[pays,setPays] = useState<payRecordEle[]>([])
    const[outstandings,setOutstandings] = useState<payRecordEle[]>([])
    const[stat,setStat] = useState<payStat>()
    

    useEffect(()=>{
        setTitle(`${mainprop.payType.name} - ${appName}`)
        getStats()
    },[])

    function handleError(task:resHandler){
        setLoad(false)
        setError(true)
        if(task.isLoggedOut()){
            navigate(`/adminlogin?rdr=${location.pathname.substring(1)}`)
        }else{
            toast(task.getErrorMsg(),0)
        }
    }

    function getStats(dontGetPays?:boolean){
        function fins(){
            if(dontGetPays){
                setLoad(false)
            }else{
                getThePays(0)
            }
        }

        setLoad(true)
        setError(false)
        makeRequest.get(`getRevenue/${mainprop.payType.payId}`,{},(task)=>{
            if(task.isSuccessful()){
                setStat(new payStat(task.getData()))
                fins()
            }else{
                handleError(task)
            }
        })
    }

    function getThePays(index:number){
        setShowPaid(true)
        setError(false)
        setLoad(true)
        makeRequest.get(`getPayments/${mainprop.payType.payId}`,{
            start:(index*20),
            count:20
        },(task)=>{
            setLoad(false)
            if(task.isSuccessful()){
                const tem:payRecordEle[] = []
                for(const key in task.getData()){
                    tem.push(new payRecordEle(task.getData()[key]))
                }
                setPays(tem)
                setShowingIndex(index)
            }else{
                handleError(task)
            }
        })
    }

    const[load, setLoad]=useState(false)
    const[loadMsg, setLoadMsg]=useState('Just a sec')
    const[error, setError]=useState(false)
    const[toastMeta, setToastMeta] = useState({visible: false,msg: "",action:2,invoked:0})
    const[timy, setTimy] = useState<{timer?:NodeJS.Timeout}>({timer:undefined});
    function toast(msg:string, action:number,delay?:number){
    var _delay = delay || 5000
    setToastMeta({
        action: action,
        msg: msg,
        visible:true,
        invoked: Date.now()
    })
    clearTimeout(timy.timer)
    setTimy({
        timer:setTimeout(()=>{
            if(Date.now()-toastMeta.invoked > 4000){
                setToastMeta({
                    action:2,
                    msg:"",
                    visible:false,
                    invoked: 0
                })
            }
        },_delay)
    });
    }

    return <div style={{
        width:'100%',
        boxSizing:'border-box',
        padding:dimen.dsk?40:20
    }}>
        <ErrorCont isNgt={false} visible={error} retry={()=>{
            setError(false)
            getStats()
        }}/>
        <div className="prgcont" style={{display:load?"flex":"none"}}>
            <div className="hlc" style={{
                backgroundColor:mye.mycol.bkg,
                borderRadius:10,
                padding:20,
            }}>
                <CircularProgress style={{color:mye.mycol.primarycol}}/>
                <Mgin right={20} />
                <mye.Tv text={loadMsg} />
            </div>
        </div>
        <Toast isNgt={false} msg= {toastMeta.msg} action={toastMeta.action} visible={toastMeta.visible} canc={()=>{
                setToastMeta({
                    action:2,
                    msg:"",
                    visible:false,
                    invoked:0,
                })
            }} />
        <div id="clk" className="hlc" onClick={()=>{
            mainprop.backy()
        }}>
            <ArrowBack className="icon" />
            <Mgin right={10} />
            <mye.HTv text="Go Back" size={14} />
        </div>
        <Mgin top={20} />
        <div style={{
            width:dimen.dsk?500:'100%',
            display:'flex',
            margin: dimen.dsk?10:5,
        }}>
            <div className="hlc" id="lshdw" style={{
                flex:1,
                backgroundColor:mye.mycol.white,
                borderRadius:10,
            }}>
                <Mgin right={15} />
                <SearchOutlined style={{
                    fontSize:20,
                    color:mye.mycol.imghint
                }} />
                <Mgin right={5} />
                <input className="tinp"
                    type="text"
                    value={search}
                    placeholder="Search"
                    onChange={(e)=>{
                        setSearch(e.target.value)
                    }}
                    style={{
                        width:'100%',
                    }}
                />
            </div>
            <Mgin right={10} />
            <div style={{
                width:100
            }}>
                <Btn txt="Search" onClick={()=>{
                    const sc = search.trim()
                    if(sc.length < 5){
                        toast('Enter at least 5 characters',0)
                        return;
                    }
                    setLoad(true)
                    makeRequest.get(`searchPayment/${mainprop.payType.payId}`,{search:search},(task)=>{
                        setLoad(false)
                        if(task.isSuccessful()){
                            setShowSearch(true)
                            const tem:payRecordEle[] = []
                            for(const key in task.getData()){
                                tem.push(new payRecordEle(task.getData()[key]))
                            }
                            setPays(tem)
                            setShowingIndex(0)
                        }else{
                            toast('No Result',0)
                        }
                    })
                }} strip={search.length < 5} />
            </div>
        </div>
        <Mgin top={30} />
        <div style={{
            display:'flex',
            width:'100%',
            flexWrap:'wrap',
            alignItems:'center'
        }}>
            <Tab1 icon={MonetizationOnOutlined} title="Total Payment" value={stat?stat.getTotal():'...'} color={mye.mycol.hs_blue} />
            <Tab1 icon={ListOutlined} title="Number of Payment" value={stat?stat.getCount():'...'} color={mye.mycol.hs_blue} />
        </div>
        <Mgin top={20} />
        <mye.HTv text={mainprop.payType.name} color={mye.mycol.primarycol} size={25} />
        <Mgin top={20} />
        <LrText wrap={!dimen.dsk}
        left={showSearch?<div style={{
            width:250,
            display:'flex'
        }}>
            <div style={{
                flex:1
            }}>
                <Btn txt="Search Result" round onClick={()=>{
                    
                }} width={150} transparent />
            </div>
            <Mgin right={10} />
            <div style={{
                flex:1
            }}>
                <Btn txt="Close Search" round onClick={()=>{
                    setShowSearch(false)
                }}  width={120}/>
            </div>
        </div>:<div style={{
            width:250,
            display:'flex'
        }}>
            <div style={{
                flex:1
            }}>
                <Btn txt="Paid" round onClick={()=>{
                    getThePays(0)
                }} transparent={!showPaid} />
            </div>
            <Mgin right={10} />
            <div style={{
                flex:1
            }}>
                <Btn txt="Outstanding" round onClick={()=>{
                    setShowPaid(false)
                }} transparent={showPaid}/>
            </div>
        </div>}
        right={<div className="flexi">
            <IconBtn icon={CloudDownloadOutlined} mye={mye} text="Download CSV" ocl={()=>{

            }} width={140} />
        </div>}
        />
        <Mgin top={15} />
        <div className="vlc" id='lshdw' style={{
            width:'100%',
            backgroundColor:mye.mycol.white,
            borderRadius:10,
            padding:dimen.dsk?20:10,
            boxSizing:'border-box'
        }}>
            <div className="hlc" style={{
                alignSelf:'flex-start'
            }}>
                <SavingsOutlined style={{
                    color:mye.mycol.secondarycol,
                    fontSize:20
                }} />
                <Mgin right={10}/>
                <mye.HTv text={showPaid?'Paid':'Outstanding'} size={16} color={mye.mycol.secondarycol} />
            </div>
            <Mgin top={20} />
            <div className="hlc" style={{
                width:dimen.dsk2?'100%':dimen.dsk?dimen.width-450:dimen.width-60,
                overflowX:'scroll'
            }}>
                {
                    showPaid?<div style={{
                        width:dimen.dsk2?'100%':undefined,
                        paddingBottom:optToShow!=-1?150:0,
                    }}>
                        <div className="hlc">
                            <MyCell text="S/N"  isBold/>
                            <MyCell text="Name"  isBold/>
                            <MyCell text="Amount"  isBold/>
                            <MyCell text="Identity No."  isBold/>
                            <MyCell text="Interval"  isBold/>
                            <MyCell text={mainprop.payType.payId==0?'Year':'Event ID'}  isBold/>
                            <MyCell text="Date"  isBold/>
                            <MyCell text="Action"  isBold/>
                        </div>
                        {
                            pays.slice((showingIndex*20),(showingIndex*20+20)).map((ele,index)=>{
                                return <div className="hlc" key={myKey+index+showingIndex*20}>
                                    <MyCell text={(index+1+showingIndex*20).toString()} />
                                    <MyCell text={ele.getName()} />
                                    <MyCell text={`N${ele.getAmt()}`} />
                                    <MyCell text={ele.getDioceseId()} />
                                    <MyCell text={ele.getInterval()} />
                                    <MyCell text={mainprop.payType.payId==0?ele.getYear():ele.getEventId()}/>
                                    <MyCell text={ele.getDate()} />
                                    <Opts index={index} pay={ele} />
                                </div>
                            })
                        }
                    </div>:<div style={{
                    width:dimen.dsk2?'100%':undefined,
                    paddingBottom:optToShow!=-1?150:0,
                }}>
                    <div className="hlc">
                        <MyCell text="S/N"  isBold/>
                        <MyCell text="Name"  isBold/>
                        <MyCell text="Amount"  isBold/>
                        <MyCell text="Identity No."  isBold/>
                        <MyCell text="Due Date"  isBold/>
                        <MyCell text="Action"  isBold/>
                    </div>
                    {
                        outstandings.slice((showingIndex*20),(showingIndex*20+20)).map((ele,index)=>{
                            return <div className="hlc" key={myKey+index+showingIndex*20}>
                                <MyCell text={(index+1+showingIndex*20).toString()} />
                                <MyCell text={ele.getName()} />
                                <MyCell text={`-N${ele.getAmt()}`} tCol={mye.mycol.red}/>
                                <MyCell text={ele.getDioceseId()} />
                                <MyCell text={ele.getDate()} />
                                <MyCell text={'Send Reminder'} tCol={mye.mycol.primarycol} ocl={()=>{
                                    setShowReminder(true)
                                }}/>
                            </div>
                        })
                    }
                </div>
                }
            </div>
            <Mgin top={20} />
            <div className="hlc">
                <ArrowBack id="clk" className="icon" onClick={()=>{
                    if(showingIndex >0){
                        const index = showingIndex-1
                        if(showPaid){
                            getThePays(index)
                        }else{
                            setShowingIndex(index)
                        }
                    }
                }} />
                <Mgin right={10} />
                {
                    Array.from({length:Math.floor(pays.length/20)+1},(_,index)=>{
                        return <div id="clk" key={myKey+index+10000} className="ctr" style={{
                            width:25,
                            height:25,
                            backgroundColor:showingIndex==index?mye.mycol.black:'transparent',
                            borderRadius:'50%'
                        }} onClick={()=>{
                            if(showPaid){
                                getThePays(index)
                            }else{
                                setShowingIndex(index)
                            }
                        }}>
                            <mye.BTv text={(index+1).toString()} color={showingIndex==index?mye.mycol.white:mye.mycol.black} size={16}/>
                        </div>
                    })
                }
                <Mgin right={10} />
                <ArrowForward id="clk" className="icon" onClick={()=>{
                    const len = Math.floor(pays.length/20)
                    if(showingIndex < len){
                        const index = showingIndex+1
                        if(showPaid){
                            getThePays(index)
                        }else{
                            setShowingIndex(index)
                        }
                    }
                }} />
            </div>
        </div>
        <PoweredBySSS />
         {/* Absolutely positioned (dialog) */}
         <div className="ctr" style={{
            display:showReminder?undefined:'none',
            position:'absolute',
            top:0,
            left:0,
            width:'100%',
            height:'100%',
            boxSizing:'border-box',
            backgroundColor:'rgba(0,0,0,0.1)',
            padding: dimen.dsk?'10% 25%':0
        }}>
            <SendReminder />
        </div>
        {/* Absolutely positioned (dialog) */}
        <div className="ctr" style={{
            display:showReceipt?undefined:'none',
            position:'absolute',
            top:0,
            left:0,
            width:'100%',
            height:'100%',
            boxSizing:'border-box',
            backgroundColor:'rgba(0,0,0,0.1)',
            padding: dimen.dsk?'10% 25%':0
        }}>
            {cpay?<PayReciept ele={cpay} />:<div></div>}
        </div>
    </div>

    function PayReciept(prop:{ele:payRecordEle}) {
        return <div className="vlc" style={{
            width:'100%',
            height:'100%',
            backgroundColor:mye.mycol.bkg,
            borderRadius:10,
            padding:20
        }}>
            <div id="clk" style={{
                    alignSelf:'flex-end'
                }} onClick={()=>{
                    setShowReceipt(false)
                }}>
                    <Close className="icon" />
                </div>
                <div className="ctr" style={{
                    flex:1
                }}>
                    <div className="vlc" id="lshdw" style={{
                        width:265,
                        padding:20,
                        boxSizing:'border-box',
                        borderRadius:10,
                    }}>
                        <mye.Tv text="PAYMENT RECEIPT" size={12} color={mye.mycol.primarycol} />
                        <Mgin top={15} />
                        <Line broken/>
                        <Mgin top={20} />
                        <LrText
                        left={<mye.Tv text="Date/Time:" size={12} />}
                        right={<mye.Tv text={prop.ele.getDate()} size={12} />}
                        />
                        <Mgin top={7} />
                        <LrText
                        left={<mye.Tv text="Type:" size={12} />}
                        right={<mye.Tv text={prop.ele.getType()} size={12} />}
                        />
                        <Mgin top={7} />
                        <LrText
                        left={<mye.Tv text="Receipt Id:" size={12} />}
                        right={<mye.Tv text={prop.ele.getReceiptId()} size={12} />}
                        />
                        <Mgin top={7} />
                        <Line broken/>
                        <Mgin top={7} />
                        <LrText
                        left={<mye.Tv text="Amount" size={12} />}
                        right={<mye.Tv text={`NGN ${prop.ele.getAmt()}`} size={12} />}
                        />
                        <Mgin top={7} />
                        <Line broken/>
                        <Mgin top={7} />
                        <LrText
                        left={<mye.Tv text="Visa Debit" size={12} />}
                        right={<mye.Tv text={`**** **** **** ****`} size={12} />}
                        />
                        <Mgin top={20} />
                        <mye.HTv text="Transaction Approved" size={12} />
                        <Mgin top={20} />
                        <Barcode value={prop.ele.getReceiptId()} height={30} displayValue={false} />
                        <Mgin top={10} />
                    </div>
                </div>
            </div>
    }

    function SendReminder(prop:{}) {
        return <div className="vlc" style={{
            width:'100%',
            height:'100%',
            backgroundColor:mye.mycol.bkg,
            borderRadius:10,
            padding:20
        }}>
            <div id="clk" style={{
                alignSelf:'flex-end'
            }} onClick={()=>{
                setShowReminder(false)
            }}>
                <Close className="icon" />
            </div>
            <div className="ctr" style={{
                flex:1
            }}>
                <mye.Tv text="Send Reminder" color={mye.mycol.primarycol} size={16} />
                <Mgin top={20} />
                <div className="hlc">
                    <Tab text="SMS" ocl={()=>{

                    }} />
                    <Mgin right={15} />
                    <Tab text="Email" ocl={()=>{

                    }} />
                </div>
            </div>
        </div>

        function Tab(prop:{text:string, ocl:()=>void}) {
            return <div id="clk" className="ctr" style={{
                width:80,
                height:100,
                borderRadius:5,
                backgroundColor:mye.mycol.btnstrip
            }} onClick={prop.ocl}>
                <mye.Tv text={prop.text} />
            </div>
        }
    }

    function Opts(prop:{index:number,pay:payRecordEle}) {
        return <div className="ctr" style={{
            flex:(dimen.dsk2)?1:undefined,
            width:(dimen.dsk2)?undefined:100,
            height:40,
            position:'relative'
        }}>
            <div id="clk" className="ctr" style={{
                width:40,
                height:40
            }} onClick={()=>{
                setOptToShow(prop.index)
            }}>
                <MoreVert className="icon" />
            </div>
            <div className="vlc" id="lshdw" style={{
                display:optToShow==prop.index?undefined:'none',
                backgroundColor:mye.mycol.white,
                borderRadius:10,
                width:100,
                position:'absolute',
                top:30,
                left:0,
                zIndex:10
            }}>
                <Close style={{
                    margin:5,
                    fontSize:15,
                    alignSelf:'flex-end',
                    color:mye.mycol.imghint
                }} onClick={()=>{
                    setOptToShow(-1)
                }} />
                <MyCell text="Receipt" ocl={()=>{
                    setCPay(prop.pay)
                    setShowReceipt(true)
                }} alignStart special />
                <Line />
                <MyCell text="Chat" ocl={()=>{
                    
                }} alignStart special/>
            </div>
        </div>
    }

    function MyCell(prop:{text:string,isBold?:boolean,alignStart?:boolean,ocl?:()=>void, special?:boolean, tCol?:string}) {
        return <div id={prop.special?'clk':undefined} className="ctr" style={{
            flex:(dimen.dsk2 && !prop.special)?1:undefined,
            width:(dimen.dsk2 && !prop.special)?undefined:100,
            height:40,
            padding:prop.alignStart?'0px 10px':undefined,
            boxSizing:'border-box',
            alignItems: prop.alignStart?'start':'center'
        }} onClick={()=>{
            setOptToShow(-1)
            if(prop.ocl){
                prop.ocl()
            }
        }}>
            {prop.isBold?<mye.BTv text={prop.text} size={14} color={mye.mycol.primarycol}  />:<mye.Tv hideOverflow text={prop.text} size={14} color={prop.tCol||mye.mycol.imghint} />}
        </div>
    }

    function FiltrLay(prop:{icon:icony,text:string}) {
        return <div id="lshdw" className="hlc" style={{
            padding:10,
            width:dimen.dsk?150:100,
            margin: dimen.dsk?10:5,
            backgroundColor:mye.mycol.white,
            borderRadius:10,
        }}>
            <prop.icon style={{
                fontSize:20,
                color:mye.mycol.imghint
            }} />
            <Mgin right={7} />
            <div style={{
                flex:1
            }}>
                <mye.Tv text={prop.text} color={mye.mycol.imghint} size={12}/>
            </div>
            <KeyboardArrowDown style={{
                fontSize:20,
                color:mye.mycol.imghint
            }} />
        </div>
    }


    function Tab1(prop:{title:string, value:string, icon:icony, color:string}) {
        
        return <div id="lshdw" style={{
            width: dimen.dsk?300:'100%',
            margin: dimen.dsk?20:'10px 0px',
            height:150,
            boxSizing:'border-box',
            position:'relative',
            borderRadius:10,
            backgroundImage: `url(${tabcard})`,
            backgroundSize: 'cover',
        }}>
            <div className="ctr" style={{
                width:70,
                height:70,
                backgroundColor:hexToRgba(prop.color,0.1),
                borderRadius:'50%',
                position:'absolute',
                top:20,
                right:20
            }}>
                <prop.icon style={{
                    fontSize:20,
                    color: prop.color
                }} />
            </div>
            <div style={{
                position:'absolute',
                left:20,
                bottom:20
            }}>
                <mye.Tv text={prop.title} color={prop.color} />
                <Mgin top={10}/>
                <mye.BTv text={prop.value} size={20}  />
            </div>
        </div>
    }

}

