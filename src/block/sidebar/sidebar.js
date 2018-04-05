(function(){
	// Открыть / закрыть меню

	let funSidebar= ()=>{
		let sidebar__title= document.getElementsByClassName('sidebar__title');
		let sidebar__box= document.getElementsByClassName('sidebar__box');
			
			for(let i= 0; i < sidebar__title.length; i++){
				sidebar__title[i].addEventListener('click', (e)=>{
					let dataSidebar= e.target.getAttribute('data-sidebar');
					let sidebar__box_curent= document.getElementById(dataSidebar);
					if(dataSidebar){
						sidebar__box_curent.classList.toggle('active');
						setTimeout(()=>{
							sidebar__box_curent.classList.toggle('visible');
						}, 10)
					}
				})
			}
	}

	funSidebar();
	document.querySelector('body').addEventListener('DOMNodeInserted', ()=>{
		if( document.querySelector('body').classList.contains('loading') ){
			funSidebar();
		}

	})

})();