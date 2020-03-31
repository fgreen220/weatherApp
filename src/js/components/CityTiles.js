import React, { useState, Fragment } from 'react';


const CityTiles = (props) => {

  const [prevClientX, setPrevClientX] = useState(-1);
  const [prevScreenX, setPrevScreenX] = useState(-1); 
  const [cityTileWidthAdjustment, setCityTileWidthAdjustment] = useState(0);
  const [expandedTileClickNumber, setExpandedTileClickNumber] = useState(1);
  const [deleteButtonIndex, setDeleteButtonIndex] = useState(-1);

  return(
    props.cities.map((city, index) => {
      // index === props.cities.length - 1 ? () => this.setState({rendered:cities}):null
      return (
          <div id='cityTileWrapper' className={props.currentForecast.length === props.cities.length ?
            `${props.currentForecast.filter(cast => cast[city])[0][city]['icon']}1`:
            'cloudy1'} style={{height:'5rem', backgroundSize:'100% 5rem', cursor:'pointer'}} id={`${city}`} key={city,index}>
            {/* {console.log(props.currentForecast.filter(cast => cast[city]))} */}
            <div onMouseMove={(event) => {
              event.persist();
              if(event.buttons === 1 && event.clientX < prevClientX-10 &&
                 prevClientX !== -1){
                  setCityTileWidthAdjustment(prevWidth => prevWidth < 10 ? prevWidth+1 : prevWidth);
                  setExpandedTileClickNumber(() => 2);
                  console.log(event.buttons, event.clientX, event.clientY);
              }
              setPrevClientX(() => event.clientX);
              
          }} 
          onTouchMove ={(event) => {
            event.persist();
            if(event.touches[0].screenX < prevScreenX-10 && prevScreenX !== -1){
                setCityTileWidthAdjustment(prevWidth => prevWidth < 10 ? prevWidth+1 : prevWidth);
                setExpandedTileClickNumber(() => 2);
                console.log(event.touches[0].screenX);
            }
            setPrevScreenX(() => event.touches[0].screenX);
            
          }} 
          onMouseDown={e => {
            e.persist();
            setDeleteButtonIndex(() => index);
            if(cityTileWidthAdjustment >= 1 && e.target.id !== 'deleteCityTileButton' &&
              e.target.id !== 'deleteCityTileText') {
              console.log(e);
              setCityTileWidthAdjustment(prevWidth => prevWidth >=1 ? 0 : prevWidth);
            }
          }}
          onClick={e => {
            if(cityTileWidthAdjustment === 0 && expandedTileClickNumber === 1){
              props.cityTileHandler(e);
            }
            if(cityTileWidthAdjustment === 0 && expandedTileClickNumber === 2){
              setExpandedTileClickNumber(() => 1);
            }
          }
          }
          onTouchStart ={() => {
            setDeleteButtonIndex(() => index);
            if(cityTileWidthAdjustment >= 1) {
              setCityTileWidthAdjustment(prevWidth => prevWidth >=1 ? 0 : prevWidth);
            }
          }}
          style={{zIndex:2, display:'grid',justifyContent: 'space-between',gridTemplateColumns:'1fr 1fr', color:'white', textShadow:'0.07em 0 black,0 0.07em black,-0.07em 0 black,0 -0.07em black'}}>
              <div>
                {/* {console.log(props.currentForecast[index])} */}
                <p style={{display:'grid',margin:'1rem 0 0 2rem',gridColumn:'1 / 2',gridRow: '1 / 2',alignSelf:'start',justifySelf:'start'}}>
                  {props.currentForecast[index] ? props.timezoneHandler(props.currentForecast[index][city]['time']*1000, 'tileTime', index) : null}
                </p>
                <h1 style={{display:'grid',margin:'0 0 0 2rem',alignSelf:'start',justifySelf:'start',gridColumn:'1 / 2',gridRow: '1 / 2'}}>
                  {props.cities.filter((area) => area.split('*')[0] === city.split('*')[0]).length > 1 ? <div style={{display:'flex'}}>{`${city.split('*')[0]}`}<sup style={{fontSize:'medium'}}> {`${city.split('*')[2]}`}</sup></div> : city.split('*')[0]}
                </h1>
              </div>
            { props.cities.length>=1 && props.currentForecast.filter(item => typeof(item[city])==='object')?
              <div style={{display:'flex', justifyContent:'flex-end'}}>
                <div style={{zIndex:2}}>
                  <h1 style={{justifySelf:'end', marginRight:'2rem'}}>
                    {props.currentForecast.length>=props.cities.length && props.currentForecast.length >=1 ?
                    `${!props.tempInCelsius ? Math.round(props.currentForecast.filter(fore => typeof(fore[city]) === 'object')[0][city].temperature) :
                    Math.round((props.currentForecast.filter(fore => typeof(fore[city]) === 'object')[0][city].temperature-32)*(5/9))}°`
                    : null
                    }
                  </h1>
                </div>
                <button
                  id='deleteCityTileButton' 
                  style={{zIndex:1, width:`10vw`, position:'relative', right:0, height:'5rem', border:0,
                  padding:0, display:cityTileWidthAdjustment<=0 ? 'none' : cityTileWidthAdjustment>0 && deleteButtonIndex === index ?
                    'block' : 'none',backgroundColor:'red'}}
                  onClick={() => {
                    props.deleteCityTileHandler(index);
                    setExpandedTileClickNumber(() => 1);
                    setCityTileWidthAdjustment(() => 0);
                  }}
                >
                  <p style={{textShadow:'none'}} id='deleteCityTileText'>Delete</p>
                </button>
              </div>
              :
              null
            }
            </div>
          </div>
      );
    })
  );
}

export default CityTiles;