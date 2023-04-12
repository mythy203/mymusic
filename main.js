const $= document.querySelector.bind(document)
        const $$= document.querySelectorAll.bind(document)
        
        const player = $('.player')
        const cd = $('.cd')
        const heading = $('header h2')
        const cdThumb = $('.cd-thumb')
        const audio = $('#audio')
        const playbtn = $('.btn-toggle-play')
        const progress = $('#progress')
        const nextBtn = $('.btn-next')
        const prevBtn = $('.btn-prev')
        const randomBtn = $('.btn-random')
        const repectBtn = $('.btn-repeat')
        const playlist= $('.playlist')
        const time_songs = $('.time-music-end');
        const step_song = $('.time-music-start');

        const app ={
          currentIndex: 0,
          isPlaying: false,
          isramdom :false,
          isrepect :false,
          songs: [
          {
                  name:'Thu cuối',
                  singer:'YANBI & MR.T & HẰNG BINGBOONG',
                  path: './assets/music/thucuoi.mp3',
                  image:'./assets/img/song6.jpg',
                  

                },
                {
                  name:'Bên Em',
                  singer:'Bích Phương',
                  path: './assets/music/benem.mp3',
                  image:'./assets/img/song1.jpg',
                  
                },
                {
                  name:'Cà phê',
                  singer:'Min',
                  path: './assets/music/caphe.mp3',
                  image:'./assets/img/song2.jpg',
                  

                },
                {
                  name:'Chạy ngay đi',
                  singer:'Sơn Tùng MTP',
                  path: './assets/music/chayngaydi.mp3',
                  image:'./assets/img/song3.jpg',
                  

                },
                {
                  name:'Đưa em đi khắp thế gian',
                  singer:'Bích Phương',
                  path: './assets/music/duaemdikhapthegian.mp3',
                  image:'./assets/img/song4.jpg',
                  

                },
                {
                  name:'Sau tất cả',
                  singer:'Erik',
                  path: './assets/music/sautatca.mp3',
                  image:'./assets/img/song5.jpg',
                  

                },
                
            ],
          render: function(){
              const htmls = this.songs.map((song, index) =>{
                return `
                  <div class="song ${index === this.currentIndex ? 'active' :''}"data-index = "${index}">
                    <div class="thumb" 
                      style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                      <h3 class="title">${song.name}</h3>
                      <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                      <i class="fas fa-ellipsis-h"></i>
                    </div>
                  </div>
                  
                `
              })
              playlist.innerHTML = htmls.join('');
              
          },
          defineProperties:function(){
              Object.defineProperty(this, 'currentSong', {
                get: function(){
                  return this.songs[this.currentIndex];
                }
              })

          },
          handleEvents: function(){
              const _this = this;
              const cdWidth = cd.offsetWidth
              
              // Xử lý quay CD
              const cdthumbanimate = cdThumb.animate([
                { transform: 'rotate(360deg)' }
              ],{
                duration: 10000,
                interations: Infinity
              })
              cdthumbanimate.pause()
              // Xử lý cuộn CD
              document.onscroll= function(){
                const scrollTop = window.scrollY || document.documentElement.scrollTop
                const newCdWidth = cdWidth - scrollTop

                cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' :0
                
              }

              // Xử lý khi click play
              playbtn.onclick = function() {
                  if(_this.isPlaying){
                      audio.pause()
                  }
                  else{
                      audio.play()
                }
              }

              // Khi song play
              audio.onplay = function(){
                  _this.isPlaying = true
                  player.classList.add('playing')
                  cdthumbanimate.play()
              }
              // Khi song pause
              audio.onpause = function(){
                _this.isPlaying = false
                player.classList.remove('playing')
                cdthumbanimate.pause()
            }
              //Khi tiến độ thay đổi %
              audio.ontimeupdate = function(){
                if(audio.duration){
                  const progressPercent = Math.floor(audio.currentTime / audio.duration *100)
                  progress.value = progressPercent
                  
              }
              // Thay đổi tiến độ bằng time
              audio.ontimeupdate = function(){
                if(audio.duration){
                    progress.value =  Math.floor((audio.currentTime/audio.duration)*100);
                    step_song.textContent = _this.getMinutesSong(progress.value);
                    time_songs.textContent = _this.setMinutesSong();
                }
            }
              
            }
              // Xử lý khi tua
              progress.onchange = function(e){
                  const seekTime = audio.duration / 100 * e.target.value
                  audio.currentTime = seekTime
              }
              //Khi next song
              nextBtn.onclick = function(){
                  if(_this.isramdom){
                      _this.playRamdomSong()
                  }
                  else{
                      _this.nextSong()
                  }
                  
                 audio.play()
                 _this.render( )
                 _this.scrollToActiveSong()
              }
              //Khi prev song
              prevBtn.onclick = function(){
                  if(_this.isramdom){
                    _this.playRamdomSong()
                  }
                  else{
                      _this.prevSong()
              }
                 audio.play()
                 _this.render( )
                 _this.scrollToActiveSong()

              }
              // Random
              randomBtn.onclick =function(e){
                _this.isramdom = !_this.isramdom 
                randomBtn.classList.toggle('active', _this.isramdom)
              }
              //Repect
              repectBtn.onclick = function(){
                _this.isrepect = !_this.isrepect
                repectBtn.classList.toggle('active', _this.isrepect) 
                 
              }
              // Xử lý next song khi hết bài hát
              
              audio.onended = function(){
                if(_this.isrepect){
                  audio.play();
                }
                else{
                  nextBtn.click()
              }
            }
            //Click playlist 
            playlist.onclick = function(e){
              const songNode =e.target.closest('.song:not(.active)')
                if(songNode || e.target.closest('.option'))
                  {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                  }
            
            }
              
          },
          setMinutesSong : function(){
            const time = audio.duration;
            const minutes = Math.floor(time % 3600 / 60).toString().padStart(2,'0');
            const seconds = Math.floor(time % 60).toString().padStart(2,'0');
            return finalTime = minutes + ':' + seconds;
          },
          getMinutesSong : function(){
            const time = audio.currentTime;
            const minutes = Math.floor(time % 3600 / 60).toString().padStart(2,'0');
            const seconds = Math.floor(time % 60).toString().padStart(2,'0');
            return finalTime = minutes + ':' + seconds;
          },
          scrollToActiveSong: function(){
            setTimeout(() => {
                $('.song.active').scrollIntoView({
                  behavior: 'smooth',
                  block: 'nearest', 
                }) 
            },300)
          },
          
          loadCurrentSong: function(){

            heading.textContent = this.currentSong.name
            cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
            audio.src = this.currentSong.path
          },
          nextSong: function(){
            this.currentIndex++
            if(this.currentIndex >= this.songs.length){
              this.currentIndex = 0
            }
            this.loadCurrentSong()
          },
          prevSong: function(){
            this.currentIndex--
            if(this.currentIndex < 0){
              this.currentIndex = this.songs.length -1
            }
            this.loadCurrentSong()
          },
          playRamdomSong: function(){
            let newIndex  
            do{
                newIndex = Math.floor(Math.random() * this.songs.length)
              }
              while(newIndex === this.currentIndex)
              this.currentIndex = newIndex
              this.loadCurrentSong()
          },
          start: function(){
              this.defineProperties()
              this.render()
              this.handleEvents() 
              this.loadCurrentSong()
              this.scrollToActiveSong()
              
            }
        }
        app.start();