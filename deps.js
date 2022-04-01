let fetchApi = async (url = '/api/posts', showCatch = 1) => {
    try {
        /* [ fetch ] */
        let
            apiPosts = await fetch(url),
            status = apiPosts.status;

        /* [ to Json ] */
        let json = await apiPosts.json();
        return { status, json };
    } catch (e) {
        /* [ Cek showCatch apakah diaktifkan apa tidak ] */
        if (showCatch === 1) {
            console.log(e);
        }
    }
}
let original_subs = async () => {
    let { json } = await fetchApi(`/api/posts?genres=original%20sub`),
        carousel = document.querySelector('.carousel'),
        tab = document.createElement('div');

    
    if (carousel && json.hasOwnProperty('items')) {
        carousel.innerHTML = '';
        tab.classList.add('home__carousel', 'owl-carousel');

        if (json.items) {
            for ({ id, data } of json.items) {
                let item = document.createElement('div');
                item.classList.add('item');
                item.innerHTML += `<div class="item">
				<!-- card -->
				<div class="card card--big">
					<div class="card__cover">
						<img src="${data.image}" alt="">
						<a href="/p/${id}" class="card__play">
							<i class="icon ion-ios-play"></i>
						</a>
					</div>
					<div class="card__content">
						<h3 class="card__title"><a href="/p/${id}">${data.title}</a></h3>
						<span class="card__category"></span>
						<span class="card__rate"></span>
					</div>
				</div>
				<!-- end card -->
			</div>`;

                tab.appendChild(item);

                /* [ START AUTORELOAD MAL ] */
                let reloadCond = 1, autoReloadMal = await setInterval(async () => {
                    if (reloadCond === 1) {
                        reloadCond = 0;

                        let mal = await fetchApi(`https://api.jikan.moe/v4/anime/${data.mal_id}`, 0);
                        if (mal.status !== 200) mal = await fetchApi(`https://api.jikan.moe/v4/anime/${data.mal_id}`);
                        let __mal = await mal.json.data;

                        if (mal.status !== 200) {
                            reloadCond = 1;
                            console.clear();
                        } else {
                            clearInterval(autoReloadMal);
                            item.querySelector('.card__rate').innerHTML = '<i class="icon ion-ios-star"></i>' + __mal.score;
                            let genreEl = item.querySelector('.card__category');
                            for (a of __mal.genres) genreEl.innerHTML += `<a href="#">${a.name}</a>`;
                        }
                    }
                }, 3000)
                /* [ END AUTORELOAD MAL ] */
            }
        }
        carousel.appendChild(tab);
        await $('.home__carousel').owlCarousel({
            mouseDrag: false,
            touchDrag: false,
            dots: false,
            loop: true,
            autoplay: false,
            smartSpeed: 600,
            margin: 30,
            responsive: {
                0: {
                    items: 2,
                },
                576: {
                    items: 2,
                },
                768: {
                    items: 3,
                },
                992: {
                    items: 4,
                },
                1200: {
                    items: 4,
                },
            }
        })
    } else {
        carousel.innerHTML = '<span style="color:#fff">Ups, kami belum ngesub proyek apapun</span>'
    }
}
let newAnime = async () => {
    let { json } = await fetchApi(),
        tab = document.querySelector('#news #tab-1 .row');

    if (tab) {
        tab.innerHTML = '';
        for (let { id, data } of json.items) {
            let parent = document.createElement('div');
            parent.setAttribute('class', 'col-6 col-sm-12 col-lg-6');
            parent.innerHTML = `<div class="card card--list">
				<div class="row">
					<div class="col-12 col-sm-4">
						<div class="card__cover">
							<span class="card__type">${data.type}</span>
							<img src="${data.image}" alt="">
							<a href="/p/${id}" class="card__play">
								<i class="icon ion-ios-play"></i>
							</a>
						</div>
					</div>
	
					<div class="col-12 col-sm-8">
						<div class="card__content">
							<h3 class="card__title"><a href="/p/${id}">${data.title}</a></h3>
							<span class="card__category"></span>
	
							<div class="card__wrap">
								<span class="card__rate"></span>
	
								<ul class="card__list">
									<li></li>
									<li></li>
								</ul>
							</div>
	
							<div class="card__description">
								<p></p>
							</div>
						</div>
					</div>
				</div>
			</div>`;

            /* [ START On Error Image ] */
            /*let __img = parent.querySelector('img');
            let imgerr = (relimg = data.image) => {
                __img.src = '';
                __img.src = relimg;
            }
            let cekErr = setInterval(() => {
            __img.onerror = imgerr();
            __img.onloadeddata = () => clearInterval(cekErr);
            },2000);*/
            /* [ END On Error Image ] */

            /* [ START AUTORELOAD MAL ] */
            let reloadCond = 1, autoReloadMal = await setInterval(async () => {
                if (reloadCond === 1) {
                    reloadCond = 0;

                    let mal = await fetchApi(`https://api.jikan.moe/v4/anime/${data.mal_id}`, 0);
                    if (mal.status !== 200) mal = await fetchApi(`https://api.jikan.moe/v4/anime/${data.mal_id}`);
                    let __mal = await mal.json.data;

                    if (mal.status !== 200) {
                        reloadCond = 1;
                        console.clear();
                    } else {
                        clearInterval(autoReloadMal);
                        parent.querySelector('.card__description p').textContent = __mal.synopsis;
                        parent.querySelector('.card__rate').innerHTML = '<i class="icon ion-ios-star"></i>' + __mal.score;
                        parent.querySelector('.card__list li:first-child').textContent = __mal.status;
                        parent.querySelector('.card__list li:last-child').textContent = __mal.rating;
                        let genreEl = parent.querySelector('.card__category');
                        for (a of __mal.genres) genreEl.innerHTML += `<a href="#">${a.name}</a>`;

                        tab.appendChild(parent);
                    }
                }
            }, 3000)
            /* [ END AUTORELOAD MAL ] */
        }
    }
}
let allAnime = async (linkApi = '/api/posts?maxResults=6') => {
    let
        { json } = await fetchApi(linkApi),
        section = document.querySelector('.section:not(.details) .row');

    if (section) {
        /* [ Hapus Loader ] */
        section.querySelector('.lds-facebook') ? section.querySelector('.lds-facebook').remove() : false;

        /* [ Loop ] */
        for (let { id, data } of json.items) {
            let div = document.createElement('div');
            div.setAttribute('class', 'col-6 col-sm-4 col-lg-3 col-xl-2');
            let html = `<div class="card">
				<div class="card__cover">
					<span class="card__type">${data.type}</span>
					<img src="${data.image}" alt="${data.title}">
					<a href="/p/${id}" class="card__play">
						<i class="icon ion-ios-play"></i>
					</a>
				</div>
				<div class="card__content">
					<h3 class="card__title"><a href="/p/${id}">${data.title}</a></h3>
					<span class="card__category"></span>
					<span class="card__rate"></span>
				</div>
			</div>`;

            div.innerHTML = html;
            section.appendChild(div);

            /* [ START AUTORELOAD MAL ] */
            let reloadCond = 1, autoReloadMal = await setInterval(async () => {
                if (reloadCond === 1) {
                    reloadCond = 0;

                    let mal = await fetchApi(`https://api.jikan.moe/v4/anime/${data.mal_id}`, 0);
                    if (mal.status !== 200) mal = await fetchApi(`https://api.jikan.moe/v4/anime/${data.mal_id}`);
                    let __mal = await mal.json.data;

                    if (mal.status !== 200) {
                        reloadCond = 1;
                        console.clear();
                    } else {
                        clearInterval(autoReloadMal);
                        div.querySelector('.card__rate').innerHTML = '<i class="icon ion-ios-star"></i>' + __mal.score;
                        let genreEl = div.querySelector('.card__category');
                        for (a of __mal.genres) genreEl.innerHTML += `<a href="#">${a.name}</a>`;
                    }
                }
            }, 3000)
            /* [ END AUTORELOAD MAL ] */

            /* [ On Error Image ]
            let __img = div.querySelector('img');
            let imgerr = (relimg = data.image) => {
                __img.src = '';
                __img.src = relimg;
            }
            let cekErr = setInterval(() => {
            __img.onerror = imgerr();
            __img.onloadeddata = () => clearInterval(cekErr);
            },2000); */
        }
        if (("nextPageToken" in json)) {
            let
                btn = document.createElement('div'),
                nexturl = `/api/posts?maxResults=6&pageToken=${json.nextPageToken}`;

            btn.classList.add('col-12');
            btn.innerHTML = '<span class="section__btn more__post">Lihat Lainnya</span>';
            section.appendChild(btn);

            btn.querySelector('.more__post').onclick = () => {
                btn.remove();

                let loadermore = document.createElement('div');
                loadermore.innerHTML = '<div></div><div></div><div></div>';
                loadermore.classList.add('lds-facebook');
                section.appendChild(loadermore);

                allAnime(nexturl);
            }
        }
    }
}
let showPost = () => {
    let
        splitPath = window.location.pathname.substring(1).split('/');
    let post = async (id) => {
        if (id) {
            let
                loader = document.createElement('div'),
                head_container = document.querySelector('.header__wrap .container'),
                body_container = document.querySelector('.section.details .container');

            loader.classList.add('show--loader', 'col-12', 'blue');

            loader.innerHTML = 'Sedang Mengunduh Data MyAnimeList...';
            head_container.appendChild(loader);

            let
                { author, data } = await JSON.parse(document.querySelector('input[name="dbPost"]').value),
                mal = await fetchApi(`https://api.jikan.moe/v4/anime/${data.mal_id}`, 0),
                jsonMal = await mal.json.data;

            loader.remove();
            body_container.querySelector('.card__cover img').setAttribute('src', jsonMal.images.webp.image_url);

            let
                card_content = body_container.querySelector('.card__content'),
                card_list = card_content.querySelectorAll('.card__list li'),
                card_meta = card_content.querySelectorAll('.card__meta li'),
                data_meta = ['title', 'genres', 'year', 'airing', 'season', 'source'];

            card_content.querySelector('.card__rate').appendChild(document.createTextNode(jsonMal.score));
            card_list[0].textContent = jsonMal.type;
            card_list[1].textContent = jsonMal.duration;

            let i = 0;
            for (dm of data_meta) {
                if (dm == 'genres') {
                    let genrelist = [];
                    for (genre of jsonMal[dm]) genrelist.push(genre.name);
                    card_meta[i].appendChild(document.createTextNode(genrelist.join(',')));
                } else if (dm == 'airing') {
                    card_meta[i].appendChild(document.createTextNode(jsonMal[dm] == true ? 'Ongoing' : 'Completed'));
                } else {
                    card_meta[i].appendChild(document.createTextNode(jsonMal[dm]));
                }
                i++;
            }

            let daftarServer = {
                shiro: "https://shiro.animein.my.id"
            }
            for (server of Object.keys(daftarServer)) {
                let { json } = await fetchApi(`${daftarServer[server]}/anime/${data.server[server]}/`),
                    daftarEps = document.querySelector('.server__list .list'),
                    serverPage = document.createElement('div'),
                    serverName = document.createElement('h3'),
                    loader = daftarEps.querySelector('.lds-facebook');

                loader ? loader.remove() : false;
                serverPage.classList.add('server');
                daftarEps.appendChild(serverPage).appendChild(serverName);
                serverName.innerHTML = `Server ${server}`;
                for (let { ep, url } of json.list) {
                    let addEps = document.createElement('div');
                    addEps.classList.add(`eps`, `ep_${ep}`);
                    addEps.innerHTML = `Episode ${ep}`;
                    serverPage.appendChild(addEps)
                    addEps.onclick = async () => {
                        let
                            showUrl = document.querySelector('#video-player .showUrl'),
                            urlList = showUrl.querySelector('.urlList'),
                            back_urlList = showUrl.querySelector('.back_urlList button');

                        showUrl.classList.add('show');

                        if (!urlList.querySelector(`.ep_${ep}`)) {

                            urlList.querySelector('.lds-facebook').classList.remove('hide');

                            let
                                getEp = await fetchApi(url),
                                newList = document.createElement('div');

                            urlList.querySelector('.lds-facebook').classList.add('hide');
                            newList.classList.add('show', 'ep', `ep_${getEp.json.ep}`);
                            !urlList.querySelector(`.ep_${getEp.json.ep}`) ? urlList.appendChild(newList) : false;
                            newList.appendChild(document.createElement('h3')).textContent = `[Server ${server}] Episode ${getEp.json.ep}`;
                            let
                                streamJson = getEp.json.stream,
                                downloadJson = getEp.json.download,
                                stream = document.createElement('div'),
                                download = document.createElement('div');

                            stream.appendChild(document.createElement('h4')).textContent = 'Streaming';
                            download.appendChild(document.createElement('h4')).textContent = 'Download';
                            newList.appendChild(stream);
                            newList.appendChild(download);
                            for (let { name, value } of streamJson) {
                                let button_stream = document.createElement('button');
                                button_stream.textContent = name;
                                stream.appendChild(button_stream);
                                button_stream.onclick = () => {
                                    let decodeValue = window.atob(value);
                                    showUrl.classList.remove('show');
                                    newList.classList.remove('show');
                                    document.querySelector('#video-player .stream').innerHTML = decodeValue;
                                }
                            }
                            for (let { quality, urls } of downloadJson) {
                                let daftar_per_quality = document.createElement('div');
                                download.appendChild(daftar_per_quality).appendChild(document.createElement('h4')).textContent = quality;
                                for (let { name, url } of urls) {
                                    let button_dl = document.createElement('button');
                                    button_dl.textContent = name;
                                    daftar_per_quality.appendChild(button_dl);
                                    button_dl.onclick = () => {
                                        window.open(url, "_blank");
                                    }
                                }
                            }
                        } else {
                            urlList.querySelector(`.ep_${ep}`).classList.add('show');
                        }
                        back_urlList.onclick = () => {
                            showUrl.classList.remove('show')
                            urlList.querySelector(`.ep_${ep}`).classList.remove('show');
                        }
                    }
                }
            }

            let get_genres = await fetchApi(`http://localhost:3000/api/posts?genres=${data.genres[0]}`);
            let section = document.querySelector('section.content .byGenres');
            for (let { id, author, data } of get_genres.json.items) {
                let div = document.createElement('div');
                div.setAttribute('class', 'col-6 col-sm-4 col-lg-6');
                let html = `<div class="card">
				<div class="card__cover">
					<span class="card__type">${data.type}</span>
					<img src="${data.image}" alt="${data.title}">
					<a href="/p/${id}" class="card__play">
						<i class="icon ion-ios-play"></i>
					</a>
				</div>
				<div class="card__content">
					<h3 class="card__title"><a href="/p/${id}">${data.title}</a></h3>
					<span class="card__category"></span>
					<span class="card__rate"></span>
				</div>
			</div>`;

                div.innerHTML = html;
                section.appendChild(div);

                /* [ START AUTORELOAD MAL ] */
                let reloadCond = 1, autoReloadMal = await setInterval(async () => {
                    if (reloadCond === 1) {
                        reloadCond = 0;

                        let mal = await fetchApi(`https://api.jikan.moe/v4/anime/${data.mal_id}`, 0);
                        if (mal.status !== 200) mal = await fetchApi(`https://api.jikan.moe/v4/anime/${data.mal_id}`);
                        let __mal = await mal.json.data;

                        if (mal.status !== 200) {
                            reloadCond = 1;
                            console.clear();
                        } else {
                            clearInterval(autoReloadMal);
                            div.querySelector('.card__rate').innerHTML = '<i class="icon ion-ios-star"></i>' + __mal.score;
                            let genreEl = div.querySelector('.card__category');
                            for (a of __mal.genres) genreEl.innerHTML += `<a href="#">${a.name}</a>`;
                        }
                    }
                }, 3000)
            }
        }
    }

    switch (splitPath[0]) {
        case 'p':
            post(splitPath[1]);
            break;

        default:
            break;
    }
}
let searchPosts = () => {
    let
        form = document.querySelector('.header__search'),
        button = form.querySelector('.header__search-content button'),
        dataSearch = form.querySelector('.header__search-data');
    button.onclick = async () => {
        dataSearch.innerHTML = 'Tunggu sebentar...';
        let
            nilai = form.querySelector('input').value,
            { json } = await fetchApi(`/api/posts/search?q=${nilai}`);
        if (json.hasOwnProperty('items')) {
            dataSearch.innerHTML = '';
            for(let {id, data} of json.items) {
                let data_item = document.createElement('a');
                data_item.href = `/p/${id}`;
                data_item.textContent = `[${data.type}] ${data.title}`;
                dataSearch.appendChild(data_item);
            }
        } else {
            dataSearch.innerHTML = `Keyword '${nilai}' tidak ditemukan`;
        }
    }
}
window.addEventListener('DOMContentLoaded', () => {
    original_subs();
    newAnime();
    allAnime();
    showPost();
    searchPosts();
})