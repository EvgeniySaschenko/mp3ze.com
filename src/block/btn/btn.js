(function(){

	let funTrackInfoBtnPlay= ()=>{
		let trackInfoBtnPlay= document.querySelector('#track-info__btn_play .btn__link_toggle');
		trackInfoBtnPlay.addEventListener('DOMSubtreeModified', ()=>{
				if(trackInfoBtnPlay.innerHTML == 'Пауза'){
					trackInfoBtnPlay.classList.remove('btn__link_play');
					trackInfoBtnPlay.classList.add('btn__link_pause');
					trackInfoBtnPlay.innerHTML= `Пауза <i></i>`;
				}
				if(trackInfoBtnPlay.innerHTML == 'Слушать онлайн'){
					trackInfoBtnPlay.classList.remove('btn__link_pause');
					trackInfoBtnPlay.classList.add('btn__link_play');
					trackInfoBtnPlay.innerHTML= `Слушать онлайн <i></i>`;
				}
		});
	}

	try {

		funTrackInfoBtnPlay();
	
	} catch (err) {
	
		// обработка ошибки
	
	}
	document.querySelector('body').addEventListener('DOMNodeInserted', ()=>{
		if( document.querySelector('body').classList.contains('loading') ){
			funTrackInfoBtnPlay();
		}
	})
	
	
})();