const tabs = [
    {
       text: 'HOLIDAYS',
       accessUserRole: ["HR", "ADMIN"],
       id:0
    },
    {
       text: 'LEAVE TYPE',
       accessUserRole: ["HR", "ADMIN"],
       id:1
    },
    {
      text: 'LEAVE APPLICATION',
      accessUserRole: ["HR", "ADMIN", "EMPLOYEE"],
      id:2
    }
    
  
  ]
    const tabsLinks = [
      {
        text: "HEAD'S APPLICATION",
        id:0
      },
      {
        text: "YOUR LEAVE APPLICATION",
        id:1
      },
      {
        text: "DEPARTMENT APPLICATION",
        id:2
      }
    ]
  
export { tabsLinks, tabs};
    