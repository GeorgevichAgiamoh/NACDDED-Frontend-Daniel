/* eslint-disable eqeqeq */
import { PersonOutline, FilterOutlined, SortOutlined, SearchOutlined, ListAltOutlined, CloudDownloadOutlined, ArrowBack, ArrowForward, MoreVert, Close, Add, KeyboardArrowDown, Savings, PaymentOutlined, SavingsOutlined, AddOutlined, CalendarMonthOutlined, MonetizationOnOutlined, ReceiptOutlined, ArrowRight } from "@mui/icons-material"
import { useState, useEffect, ChangeEvent, useRef } from "react"
import useWindowDimensions from "../../../../helper/dimension"
import { myEles, setTitle, appName, Mgin, Btn, LrText, IconBtn, Line, icony, EditTextFilled, MyCB, DatePicky, ErrorCont, getPayRef, hexToRgba, spin_ptypes } from "../../../../helper/general"
import { indivEle, payTypeEle } from "../../../classes/classes"
import { format } from "date-fns"
import { CircularProgress } from "@mui/material"
import Toast from "../../../toast/toast"
import { makeRequest, resHandler } from "../../../../helper/requesthandler"
import { useLocation, useNavigate } from "react-router-dom"
import {  dioceseBasicinfo, eventEle, payStat } from "../../../classes/models"
import { PoweredBySSS } from "../../../../helper/nacdded"
import tabcard from "../../../../assets/tabcard.png"
import naira from "../../../../assets/naira.png"



export function AdminPayTypes(mainprop:{actiony:(action:number,payType?:payTypeEle)=>void}){
    const dimen = useWindowDimensions()
    const navigate = useNavigate()
    const location = useLocation()
    const mye = new myEles(false)
    const myKey = Date.now()
    const[optToShow,setOptToShow] = useState(-1)
    const[newPay,setNewPay] = useState(false)
    const payTypes = [
        new payTypeEle('Annual Dues',10000,0),
        new payTypeEle('Events',0,1),
    ]
    const[totPays,setTotPays] = useState('...')
    const[totCount,setTotCount] = useState('...')
    const[years, setYears] = useState<string[]>([])


    useEffect(()=>{
        setTitle(`Payment Types - ${appName}`)
        const sy = new Date().getFullYear()
        const tem:string[] = []
        for(let i = sy; i > 2023; i--){
            tem.push(i.toString())
        }
        setYears(tem)
        getStat()
    },[])

    function getStat(){
        makeRequest.get(`getRevenue/0`,{},(task)=>{
            if(task.isSuccessful()){
                const st0 = new payStat(task.getData())
                makeRequest.get(`getRevenue/1`,{},(task)=>{
                    if(task.isSuccessful()){
                        const st1 = new payStat(task.getData())
                        setTotPays((parseInt(st0.getTotal())+parseInt(st1.getTotal())).toString())
                        setTotCount((parseInt(st0.getCount())+parseInt(st1.getCount())).toString())
                    }
                })
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

    return <div className="vlc" style={{
        width:'100%',
        boxSizing:'border-box',
        padding:dimen.dsk?40:20
    }}>
        <ErrorCont isNgt={false} visible={error} retry={()=>{
            setError(false)
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
        <div style={{
            alignSelf:'flex-end'
        }}>
            <IconBtn icon={Add} text="Add Payment" mye={mye} ocl={()=>{
                setNewPay(true)
            }} width={160} bkg={mye.mycol.primarycol}/>
        </div>
        <Mgin top={10} />
        <div style={{
            display:'flex',
            width:'100%',
            flexWrap:'wrap',
            alignItems:'center'
        }}>
            <Tab1 title="Total Payment" value={totPays} color={mye.mycol.hs_blue} />
            <Tab1 icon={PersonOutline} title="Number of Payments" value={totCount} color={mye.mycol.hs_blue} />
        </div>
        <Mgin top={50} />
        <div className="hlc" id="lshdw" style={{
            width:'100%',
            backgroundColor:mye.mycol.white,
            borderRadius:10,
            padding:dimen.dsk?20:10,
            boxSizing:'border-box'
        }}>
            <LrText wrap={!dimen.dsk}
            left={<div>
                <div className="hlc">
                    <ReceiptOutlined style={{
                        color:mye.mycol.secondarycol,
                        fontSize:20
                    }} />
                    <Mgin right={10}/>
                    <mye.HTv text="Pending Payments" size={16} color={mye.mycol.secondarycol} />
                </div>
                <Mgin top={10} />
                <mye.Tv text="See a list of pending payments for your approval" />
            </div>}
            right={<Btn strip txt="SEE PENDING PAYMENTS" width={200} onClick={()=>{
                mainprop.actiony(2)
            }} />}
            />
        </div>
        <Mgin top={50} />
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
                <PaymentOutlined style={{
                    color:mye.mycol.secondarycol,
                    fontSize:20
                }} />
                <Mgin right={10}/>
                <mye.HTv text="Payment Type" size={16} color={mye.mycol.secondarycol} />
            </div>
            <Mgin top={20} />
            <div className="hlc" style={{
                width:dimen.dsk2?'100%':dimen.dsk?dimen.width-450:dimen.width-60,
                overflowX:'scroll'
            }}>
                <div style={{
                    width:dimen.dsk2?'100%':undefined,
                    paddingBottom:optToShow!=-1?150:0,
                }}>
                    <div className="hlc">
                        <MyCell text="S/N"  isBold/>
                        <MyCell text="Name"  isBold/>
                        <MyCell text="Amount"  isBold/>
                        <MyCell text="Interval"  isBold/>
                        <MyCell text="Category"  isBold/>
                        <MyCell text="Tiers"  isBold/>
                        <MyCell text="Action"  isBold/>
                    </div>
                    {
                        payTypes.map((ele,index)=>{
                            return <div className="hlc" key={myKey+index}>
                                <MyCell text={(index+1).toString()} />
                                <MyCell text={ele.name} />
                                <MyCell text={'N'+ele.amt} />
                                <MyCell text={ele.getinterval()} />
                                <MyCell text={ele.getType()} />
                                <MyCell text={ele.getTier()} />
                                <Opts index={index} payType={ele} />
                            </div>
                        })
                    }
                </div>
            </div>
        </div>
        <PoweredBySSS />
        {/* Absolutely positioned (dialog) */}
        <div className="ctr" style={{
            display:newPay?undefined:'none',
            position:'absolute',
            top:0,
            left:0,
            width:'100%',
            height:'100%',
            backgroundColor:'rgba(0,0,0,0.1)'
        }}>
            <AddPay outstandings={years} closy={(ok)=>{
                setNewPay(false)
                if(ok){
                    toast('Payment Uploaded',1)
                }
            }} />
        </div>
    </div>

    

    function Opts(prop:{index:number,payType:payTypeEle}) {
        return <div className="ctr" style={{
            flex:(dimen.dsk2)?1:undefined,
            width:(dimen.dsk2)?undefined:100,
            height:40,
        }}>
            <Btn txt="View" bkg={mye.mycol.btnstrip} tcol={mye.mycol.primarycol} smallie width={100} onClick={()=>{
                mainprop.actiony(1,prop.payType)
            }} />
        </div>
    }

    function MyCell(prop:{text:string,isBold?:boolean,alignStart?:boolean,ocl?:()=>void, special?:boolean}) {
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
            {prop.isBold?<mye.BTv text={prop.text} size={14} color={mye.mycol.primarycol}  />:<mye.Tv hideOverflow text={prop.text} size={14} color={mye.mycol.imghint} />}
        </div>
    }


    function Tab1(prop:{title:string, value:string, icon?:icony, color:string}) {
        
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
                {prop.icon?<prop.icon style={{
                    fontSize:20,
                    color: prop.color
                }} />:<img src={naira} height={20} alt="." color={prop.color} />}
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

function AddPay(prop:{closy:(ok?:boolean)=>void,outstandings:string[],event?:eventEle}) {
    const location = useLocation()
    const navigate = useNavigate()
    const mye = new myEles(false);
    const dimen = useWindowDimensions()
    const myKey = Date.now()
    const ptype = prop.event?'1':'0'
    const[diod,setDiod] = useState('')
    const[dpd,setDpd] = useState<Date>()
    const[askDpd, setAskDpd] = useState(false)

    const[year,setYear] = useState('')

    const[receipt,setReceipt] = useState<File>()
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(()=>{
        
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
        backgroundColor:mye.mycol.bkg,
        borderRadius:10,
        padding:dimen.dsk2?70:dimen.dsk?40:20,
        boxSizing:'border-box',
        overflow:'scroll',
        height:'75%',
        width:dimen.dsk2?'35%':dimen.dsk?'50%':'80%'
    }}>
        <ErrorCont isNgt={false} visible={error} retry={()=>{
            setError(false)
            
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
        <div className="vlc" style={{
            width:'100%',
        }}>
            <Close className="icon" style={{
                alignSelf:'flex-end'
            }} onClick={()=>{
                prop.closy()
            }}/>
        </div>
        <Mgin top={10} />
        <div style={{
            width:'100%'
        }}>
            <mye.Tv text="*Diocese ID" />
            <Mgin top={1}/>
            <mye.Tv text="Get diocese ID from the directory tab" size={12} />
            <Mgin top={3}/>
            <EditTextFilled hint="123" min={1} value={diod} digi recv={(v)=>{
                setDiod(v.trim())
            }} />
        </div>
        <Mgin top={20} />
        <mye.Tv text="*Date Paid" />
        <Mgin top={5}/>
        <div style={{
            width:'100%',
            height:45,
            borderRadius:8,
            backgroundColor:mye.mycol.btnstrip,
            padding:10,
            boxSizing:'border-box',
            position:'relative'
        }} >
            <LrText 
            left={<div id="clk" onClick={()=>{
                setAskDpd(true)
            }}><mye.Tv text={dpd?format(dpd,'dd-MM-yy'):'DD/MM/YY'} /></div>}
            right={<CalendarMonthOutlined id="clk" style={{
                fontSize:20,
                color:mye.mycol.secondarycol
            }} onClick={()=>{
                setAskDpd(true)
            }}/>}
            />
            <div style={{
                display:askDpd?undefined:'none',
                position:'absolute',
                top:0,
                left:0,
                zIndex:2,
                pointerEvents:'auto'
            }}>
                <DatePicky fromYear={new Date().getFullYear()-20} toYear={new Date().getFullYear()} focusYear={new Date().getFullYear()-1} rdy={(d)=>{
                    setAskDpd(false)
                    setDpd(d)
                }} closy={()=>{
                    setAskDpd(false)
                }}/>
            </div>
        </div>
        <div style={{
            width:'100%',
            display: ptype=='0'?undefined:'none'
        }}>
            <Mgin top={20} />
            <div style={{
                width:'100%'
            }}>
                <mye.Tv text="*Year Being Paid For" />
                <Mgin top={3}/>
                <select id="dropdown" name="dropdown" value={year} onChange={(e)=>{
                    setYear(e.target.value)
                }}>
                    <option value="">Choose Year</option>
                    {
                        prop.outstandings.map((yr,index)=>{
                            return <option key={myKey+index+1} value={yr}>{yr}</option>
                        })
                    }
                </select>
            </div>
        </div>
        <Mgin top={20} />
        <LrText wrap={!dimen.dsk}
        left={<div>
            <mye.Tv text="Receipt, if any" size={12} color={mye.mycol.primarycol}  />
            <div style={{
                display:receipt?undefined:'none'
            }}>
                <Mgin top={2} />
                <mye.Tv text={`${receipt?receipt.name:''} added`} size={12} color={mye.mycol.primarycol} />
            </div>
        </div>}
        right={<div>
            <input
                type="file"
                onChange={(e)=>{
                    const file = e.target.files?.[0];
                    if(file){
                        setReceipt(file)
                    }
                }}
                ref={fileInputRef}
                style={{ display: 'none' }}
            />
           <IconBtn icon={Add} mye={mye} ocl={()=>{
                fileInputRef.current?.click()
            }} text="ATTACH DOC" />
        </div>}
        />
        <Mgin top={20} />
        <Btn txt="ADD PAYMENT" onClick={()=>{
            if(diod.length==0){
                toast('Please add diocese ID',0)
                return;
            }
            if(!dpd){
                toast('Please add date paid',0)
                return;
            }
            if(ptype=='0' && year.length==0){
                toast('Please set year being paid for',0)
                return;
            }
            setLoad(true)
            let amt = ptype=='0'?'10000':prop.event!.getFee()
            makeRequest.get(`getDioceseBasicInfo/${diod}`,{},(task)=>{
                if(task.isSuccessful()){
                    if(task.exists()){
                        const mbi = new dioceseBasicinfo(task.getData())
                        const puuid = Date.now().toString() 
                        const pld:{[key:string]:string} = {
                            ref: getPayRef(ptype,amt,mbi.getDioceseID(),puuid),
                            name: mbi.getName(),
                            time: dpd.getTime().toString()
                        }
                        if(ptype=='0'){
                            pld['year'] = year
                        }else{
                            pld['event'] = prop.event!.getEventId()
                        }
                        makeRequest.post('uploadPayment',pld,(task)=>{
                            if(task.isSuccessful()){
                                //Upload receipt if provided
                                if(receipt){
                                    makeRequest.uploadFile(`receipts_${ptype}`,puuid,mbi.getDioceseID(),receipt, (task)=>{
                                        setLoad(false)
                                        if(task.isSuccessful()){
                                            prop.closy(true)
                                        }else{
                                            if(task.isLoggedOut()){
                                                navigate('/login')
                                                return
                                            }
                                            toast("Could not upload receipt: "+task.getErrorMsg(),0)
                                        }
                                    })
                                }else{
                                    setLoad(false)
                                    prop.closy(true)
                                }
                            }else{
                                handleError(task)
                            }
                        })
                    }else{
                        setLoad(false)
                        toast('No member with that ID',0)
                    }
                }else{
                    handleError(task)
                }
            })
        }} />
    </div>
}