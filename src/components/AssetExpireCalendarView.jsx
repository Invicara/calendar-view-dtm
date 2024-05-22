import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import multiMonthPlugin from '@fullcalendar/multimonth';
import { IafItemSvc } from '@invicara/platform-api'
import moment from "moment";
import './AssetExpireCalendar.scss'

let ctx = null

const AssetExpireCalendarView = ( props ) => {
  console.log('ADam props', props)
  const { history, handler } = props;
  const [collections, setCollections] = useState()
  const [assetData, setAssetData] = useState()
  const [calendarEvents, setCalendarEventsa] = useState([])
  const [popupModal, setPopupModal] = useState(false);
  const [modalAssets, setModalAssets] = useState([])
  const [assetModalData, setAssetModalData] = useState([])

  useEffect(() => {
    getCollections()
  }, [])

  useEffect(() => {
    // getItems()
  }, [collections])

  const getCollections = async () => {
console.log('Adam handler?.config?.collectionName', handler?.config?.collectionName)

const res = await IafItemSvc.getAllNamedUserItems({
  query: {
    _itemClass: 'NamedUserCollection',
    _userType: "iaf_ext_asset_coll",
    _namespaces: ['dtm001_TsMl5XyK']
  }
})
console.log('Adam res', res)

    await IafItemSvc.getAllNamedUserItems({
      query: {
        _itemClass: 'NamedUserCollection',
        _userType: "iaf_ext_asset_coll",
        _namespaces: ['dtm001_TsMl5XyK']
      }
    }).then((colls) => {
      console.log('Adam colls', colls)
      setCollections(colls)
    })

  }

  const getItems = async () => {
    let calendarProperty = handler?.config?.calendarProperty
    let options = { page: { _pageSize: 3000 } }

    const res = await IafItemSvc.getRelatedItems(
      collections[0]._userItemId,
      {},
      ctx,
      options)

    console.log('Adam res', res)

    IafItemSvc.getRelatedItems(
      collections[0]._userItemId,
      {},
      ctx,
      options).then((assetItems) => {
        // Create object for calendar......
        let assetData = []
        assetItems._list.map((items) => {
          if (items.properties[calendarProperty].val != undefined) {
            let formateDate = getDateFormat(items.properties[calendarProperty].epoch)
            let currentDate = moment(new Date()).format('YYYY-MM-DD')
            let obj = {
              title: items['Asset Name'],
              start: formateDate,
              expDate: formateDate,
              assetId: items._id
            }
            let dateDiff = moment(formateDate).diff(moment(currentDate), 'days')
            if (dateDiff >= 5) {
              obj.backgroundColor = "green"
              obj.text = "Assets will expire"
            }
            else if (dateDiff >= 2 && dateDiff <= 4) {
              obj.text = "Assets about to expire"
              obj.backgroundColor = "orange"
              obj.textColor = "white"
            }
            else if (dateDiff >= 0) {
              obj.text = "Assets will expire soon.."
              obj.backgroundColor = "purple"
            }
            else {
              obj.text = "Assets expired"
              obj.backgroundColor = "red"
            }

            assetData.push(obj)
          }
        })
        console.log('Adam assetData', assetData)
        setAssetData(assetData)
        const finalAssetData = Object.values(assetData.reduce(
          (map, el) => {
            map[el.start] ? map[el.start].count++ : map[el.start] = {
              ...el,
              count: 1
            };
            return map;
          }, {}
        ));
        console.log('Adam finalAssetData', finalAssetData)
        setCalendarEventsa(finalAssetData)
      })
  }

  //Redirect to Navigation page
  const redirectToNavigation = (assetId) => {
    history.push(`navigator?entityType=Asset&selectedEntities=${assetId}&query%5Btype%5D=%3C%3CID_SEARCH%3E%3E&query%5Bvalue%5D=${assetId}&senderEntityType=Asset&script=getAssets`)
  }

  return (
    <div className='asset-calendar-body'>
      <h1 className='calendar-heading'>Asset Calendar</h1>
      <FullCalendar
        plugins={[dayGridPlugin, multiMonthPlugin]}
        initialView='dayGridMonth'
        views={{
          dayGridMonth: {
            type: 'dayGridMonth',
            buttonText: 'Month',
          },
          dayGridWeek: {
            type: 'dayGridWeek',
            buttonText: 'Week',
          },
          multiMonth: {
            type: 'multimonth',
            duration: { months: 12 }, // Customize the number of months to display
            buttonText: 'Year',
          },
        }}
        headerToolbar={{
          right: 'prev,next',
          center: 'title',
          left: 'dayGridMonth,dayGridWeek,multiMonth', // Include both dayGridMonth and multiMonth
        }}
        weekends={true}
        events={calendarEvents}
        eventContent={renderEventContent}
        themeSystem="Simplex"
        eventClick={handleEventClick}
      />
      {popupModal && (
        <div className="modal ac-modal-backdrop">
          <div onClick={handleEventClick} className="overlay"></div>
          <div className="modal-content ac-modal-content">
            <div className='ac-modal-header'>
              <div className='modal-header-content'>
                <div className='ac-modal-header-name'><h1>Asset Name</h1></div>
                <div> <button className="close-modal MuiButtonBase-root MuiButton-root MuiButton-contained" onClick={closeModal}>CLOSE</button></div>
              </div>

            </div>
            <div className=" ac-modal-table mt-5 modal-table">
              <table className="table table-striped table-sm">
                <tbody>

                  {assetModalData.map((assetItems, index) =>
                    <tr className='assetInfo-table' key={index}>
                      <td>
                        <div>
                          {assetItems?.title}
                        </div>
                      </td>
                      <td>
                        <div className='asset-action'>
                          <span class="action-button" onClick={() => redirectToNavigation(assetItems?.assetId)}><i class="inv-icon-svg inv-icon-nav " title='Navigator' ></i></span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      )}

    </div>
    )

  function closeModal() {
    setPopupModal(!popupModal);
  }

  function handleEventClick(clickInfo) {
    let expireDate = clickInfo.event.extendedProps.expDate;
    let assets = assetData.filter((item) => {
      return item.expDate == expireDate
    })
    setAssetModalData(assets)
    setPopupModal(!popupModal);
  }

  function getDateFormat(inputTimestamp) {

    return moment.unix(inputTimestamp / 1000).format('YYYY-MM-DD');

  }

  function renderEventContent(eventInfo) {
    return (
      <>
        <b>  {eventInfo.event.extendedProps.count} - {eventInfo.event.extendedProps.text} </b>
        {/* <i>{eventInfo.event.title}</i> */}
      </>
    )
  }

}

export default AssetExpireCalendarView