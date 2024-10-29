import { NextRequest, NextResponse } from "next/server";
import { verifyJwtToken } from "./lib/actions/TokenProcess";

//*Burdaki işlem kısacası nextUrl url olarak paramter alıyoruz AUTHPAGES dizisinde some ile bizim url imiz ile eşleşen var ise isAuthPages some metodu dolayısıyla true olacak.
//*Eşleşen var ise Bu da bizim authPages içinde olduğumuzdan dolayı hasVerifiedTokenı aramadan gitmemizi sağlıcak.
const AUTH_PAGES = ["/signin", "/signup"];
const isAuthPages = (url: string) =>
  AUTH_PAGES.some((page) => page.startsWith(url));

//* nextUrl gitmek istediğimiz url i temsil eder.
//* url ise bizim şuan bulunduğumuz url i temsil eder.
//* cookies de çerezlerimizi temsil eder tokenları ve diğer kişiye özgü user experinece ile ilgili bilgileri burda saklarız.
//* Her üçüde requestten gelir. Şu şekilde desctructer edip kullanabilirsin const {url,nextUrl,cookies}=request;
export default async function middleware(request: NextRequest) {
  // return NextResponse.redirect(new URL('/uploadvideos',request.url))
  const { url, nextUrl, cookies } = request;

  //* Normal şekilde direk cookies.get('tokenismi') çağırır isek bu bize {key:'tokenismi',value:"asdasd"}; burda direk alırsak obje dönüyor bu şekilde key value olarak iki değer.
  //! Eğer tokenın içindeki value ya ihtiyacımız varsa bunu descturecter edebiliriz. Ya da önce tokenı tutup daha sonra içinden token.value alınabilir.
  //*-------------------------------------------------------------------- */
  //* Token içindeki value yü almanın iki yolu desctructer edebiliriz ya da ayrı alabilriz.
  //* const token=cookies.get('token');
  //* const value=token?.value;
  const { value: token } = cookies.get("user") ?? { value: null }; //*value keyini desctruct edip alıyoruz ad olarak da token olarak alıyoruz yani value as token;

  const hasVerifiedToken = token && (await verifyJwtToken(token));
  //* Burda gitmek isteidğimiz url i tutmamız  gerek sebebi infinty loop a girmemek çünkü middleware sign-signup işlemlerindede Geçerli bu sonsuz döngüye koyup app imizi crush ediyor.
  //*Önüne geçmek için gitmek istediğimiz url i tutup
  const isAuthPageRequest = isAuthPages(nextUrl.pathname);
  // Dashboarda gitmeden admin kontrolü
  // if(nextUrl.pathname==="/dashboard"){
  // Admin cookies kontrolü yapılacak
  // }
  //! Eğer auth işlemleri yapılan bir sayfaya request işlemi get işlemi veya psot farketmez yapılıyorsa isAuthPageRequest True olcak içerisine giricez eğer tokenımız yoksa devam edfebilir
  //! Aksi halde tokenı olup giriş yapmış ya da kayıt olmuş biri tekrar buralara erişemezsin anasayfaya yönlendiriyoruz.
  if (isAuthPageRequest) {
    if (!hasVerifiedToken) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/", url));
  }

  if (nextUrl.pathname === "/create-academy") {
    if (!hasVerifiedToken) {
      //* Burda searchparams ile queryi tutuyoruz ki eğer kişi tokenı yoksa ve token ihtiyacı olan bir yere gitmek istiyorsa önce işlemi yapıp sonra kaldığı yerden devam edebilsin.
      const searchParams = new URLSearchParams(nextUrl.searchParams); // içeriğini eğer searchParamsla uygularsak gitmek isteidği yerdeki queryleride tutmuş oluruz.
      searchParams.set("next", nextUrl.pathname);
      return NextResponse.redirect(new URL(`/signin?${searchParams}`, url));
    }
    return NextResponse.next();
  }

  if (!hasVerifiedToken) {
    //* Burda searchparams ile queryi tutuyoruz ki eğer kişi tokenı yoksa ve token ihtiyacı olan bir yere gitmek istiyorsa önce işlemi yapıp sonra kaldığı yerden devam edebilsin.
    const searchParams = new URLSearchParams(nextUrl.searchParams); // içeriğini eğer searchParamsla uygularsak gitmek isteidği yerdeki queryleride tutmuş oluruz.
    searchParams.set("next", nextUrl.pathname);

    return NextResponse.redirect(new URL(`/signin?${searchParams}`, url));
  }

  return NextResponse.next();
}

//* Middleware ın işleyeceği url pathnameler.
//* Bu url lerden herhangi birinden get , post gibi request işlemi yapacak olursa araya girip önce middleware içeriğini çalıştırır sonra devam eder.
export const config = {
  matcher: ["/signin", "/signup", "/create-academy"],
  unstable_allowDynamic: [
    // use a glob to allow anything in the function-bind 3rd party module
    "/node_modules/function-bind/**",
  ],
};
