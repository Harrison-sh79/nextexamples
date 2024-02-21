import React from "react";

function Page({ params }: { params: { slug: string[] } }) {
  return (
    <div>
      <h1>no slugs</h1>
      {/* {params?.slug[0] && (<h1>{params?.slug[0]}</h1>)} */}
    </div>
  );
}

export default Page;
