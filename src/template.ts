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
    }
    .side-nav-container .overlay {
      position: absolute;
      height: 100%;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.6);
      transition: opacity cubic-bezier(1, 0, 1, 1) 300ms;
      will-change: opacity;
      top: 0;
    }
    .side-nav-slot {
      background-color: #FFF;
      height: 100%;
      width: 300px;
      box-shadow: 14px 0px 15px -7px rgba(0, 0, 0, 0.6);
      will-change: transform;
      transition: transform cubic-bezier(1, 0, 1, 1) 300ms;
    }
    .no-anime .overlay, .no-anime .side-nav-slot {
      transition: none;      
    }
    .no-show {
      pointer-events: none;
    }
  </style>
  <div class="side-nav-container">
    <div class="overlay"></div>
    <div class="side-nav-slot">
      <slot/>
      ul.ss
    </div>    
  <div>
`