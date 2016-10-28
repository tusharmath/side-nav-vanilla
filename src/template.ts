export default `
  <style>
    .side-nav-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.6);
    }
    .side-nav-slot {
      background-color: #FFF;
      height: 100%;
      width: 300px;
      box-shadow: 14px 0px 15px -7px rgba(0, 0, 0, 0.6);        
    }
  </style>
  <div class="side-nav-container">
    <div class="side-nav-slot">
      <slot/>
    </div>
  <div>
`