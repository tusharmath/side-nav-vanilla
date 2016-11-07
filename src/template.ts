export default `
  <style>
    
    .side-nav-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
      user-select: none;
      -webkit-tap-highlight-color:  rgba(255, 255, 255, 0); 
    }
    .side-nav-slot {
      background-color: #FFF;
      height: 100%;
      width: 300px;
      box-shadow: 14px 0px 15px -7px rgba(0, 0, 0, 0.6);
      will-change: transform;
      transition: transform cubic-bezier(0, 0, 0.3, 1) 300ms 300ms;
    }
    .no-anime > div {
      transition: none;
    }
    .no-show {
      pointer-events: none;      
    }
    .overlay {
      background-color: rgba(0, 0, 0, 0.6);
      transition: opacity cubic-bezier(0, 0, 0.3, 1) 300ms 300ms;
      will-change: opacity;
      height: 100%;
      position: absolute;
      width: 100%;
      left: 0;
    }
    .transition-quick {
      transition-duration: 100ms;
      transition-timing-function: cubic-bezier(0, 0, 0, 1);
    } 
  </style>
  <div class="side-nav-container">
    <div class="overlay"></div>
    <div class="side-nav-slot">
      <slot/>
    </div>
  <div>
`
