// E-posta kuralı: hem formda (RequestForm) hem sunucuda (api/request.js) kullanılır.
// Domain parçaları dolu olmalı, son uzantı (TLD) en az 2 harf ve yalnızca harf olmalı:
// a@b, a@b., a@b..c, a@gmail.c, a@gmail.c0m reddedilir; a@gmail.co, a@mail.com.tr kabul edilir.
const EPOSTA = /^[^\s@]+@([^\s@.]+\.)+[a-z]{2,}$/i

export const EPOSTA_HATA = 'Lütfen geçerli bir e-posta adresi gir.'

export const epostaGecerli = (eposta) => eposta.length <= 254 && EPOSTA.test(eposta)
