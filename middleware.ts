import { NextResponse, type NextRequest } from "next/server";

// ホワイトリストに登録されたIPアドレスをセット形式で取得
const ipWhiteList = new Set(
  process.env.IP_WHITE_LIST?.split(",").map((item: string) => item.trim())
);

// アクセス制限対象のFQDNリストをセット形式で取得
const accessRestrictionFqdnList = new Set(
  process.env.ACCESS_RESTRICTION_FQDN_LIST?.split(",").map((item: string) => item.trim())
);

// アクセス制限をかけるエンドポイント
const restrictedPaths = ["/attendance/clockin", "/attendance/clockout", "/attendance/goout", "/attendance/return"];

export function middleware(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    const clientIp = request.ip as string;
    const requestUrl = request.nextUrl;

    // ホワイトリストにないIPアドレスからのアクセスかどうか、特定のFQDNかどうかを確認
    if (
      !ipWhiteList.has(clientIp) && 
      accessRestrictionFqdnList.has(requestUrl.host) && 
      restrictedPaths.includes(requestUrl.pathname) // 複数のパスに適用
    ) {
      console.info(
        `ホワイトリストに追加されていないIPアドレスからアクセスされたため、アクセスを拒否しました。[clientIp = ${clientIp}, requestUrl = ${requestUrl.host}]`
      );
      return new NextResponse(null, { status: 401 });
    } else {
      console.info(
        `ホワイトリストに追加されているIPアドレスからアクセスされました。[clientIp = ${clientIp}, requestUrl = ${requestUrl.host}]`
      );
    }
  }
}

export const config = {
  matcher: ["/attendance/:path*"], // "/attendance" 以下の全てのパスに適用
};
