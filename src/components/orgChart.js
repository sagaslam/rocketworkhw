// orgChart.js - ES6 module for org chart using CDN libraries

let chart

const nodeContentTemplate = (d, i, arr, state) => {
  return `
    <div style="padding-top:30px;background-color:none;margin-left:1px;height:${
      d.height
    }px;border-radius:2px;overflow:visible">
      <div style="height:${
        d.height - 32
      }px;padding-top:0px;background-color:white;border:1px solid lightgray;">

        <img src="/src/assets/images/${d.data.imageUrl}" 
             style="margin-top:-30px;margin-left:${
               d.width / 2 - 30
             }px;border-radius:100px;width:60px;height:60px;" />

        <div style="margin-top:-33px;background-color:#0A3E65;height:14px;width:${
          d.width - 2
        }px;border-radius:1px"></div>

        <div style="padding:20px; padding-top:35px;text-align:center">
          <div style="color:#111672;font-size:16px;font-weight:bold">${
            d.data.name
          }</div>
          <div style="color:#404040;font-size:16px;margin-top:4px">${
            d.data.positionName
          }</div>
        </div> 
        
        <div style="display:flex;justify-content:space-between;padding-left:15px;padding-right:15px;">
          <ul class="icons" 
          <li><a href=" ${
            d.data.profileUrl
          }" class="icon brands fa-linkedin"></a></li>
          </ul
        </div>
        
      </div>     
    </div>
  `
}

// Utility function to ensure CDN libraries are loaded
const waitForLibraries = () => {
  return new Promise((resolve, reject) => {
    const maxAttempts = 100 // Increased attempts
    let attempts = 0

    const checkLibraries = () => {
      attempts++

      if (typeof d3 !== 'undefined' && typeof d3.OrgChart !== 'undefined') {
        console.log('D3 libraries loaded successfully')
        resolve()
      } else if (attempts >= maxAttempts) {
        reject(new Error('D3 libraries failed to load within timeout'))
      } else {
        setTimeout(checkLibraries, 50) // Check every 50ms
      }
    }

    checkLibraries()
  })
}

const initOrgChart = async () => {
  try {
    console.log('Loading org chart data...')
    const dataFlattened = await d3.csv('/src/data/rocketworksteam.csv')
    console.log('Data loaded:', dataFlattened)

    chart = new d3.OrgChart()
      .container('.chart-container')
      .data(dataFlattened)
      .nodeWidth((d) => 250)
      .initialZoom(0.9)
      .nodeId((d) => d.id)
      .nodeHeight((d) => 175)
      .childrenMargin((d) => 40)
      .compactMarginBetween((d) => 15)
      .compactMarginPair((d) => 80)
      .nodeButtonWidth((d) => 40)
      .nodeButtonHeight((d) => 40)
      .nodeButtonX((d) => -20)
      .nodeButtonY((d) => -20)
      .nodeContent(nodeContentTemplate)
      .render()

    console.log('Org chart rendered successfully')
  } catch (error) {
    console.error('Error loading org chart:', error)

    // Show error message in container
    const container = document.querySelector('.chart-container')
    if (container) {
      container.innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center; height: 100%; color: #666;">
          <div style="text-align: center;">
            <h3>Unable to load team chart</h3>
            </div>
        </div>
      `
    }
  }
}

const getChart = () => chart

const updateChart = (newData) => {
  if (chart) {
    chart.data(newData).render()
  }
}

const destroyChart = () => {
  if (chart) {
    const container = document.querySelector('.chart-container')
    if (container) {
      container.innerHTML = ''
    }
    chart = null
  }
}

export { initOrgChart, getChart, updateChart, destroyChart, waitForLibraries }
