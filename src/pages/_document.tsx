import {
  DocumentHeadTags,
  documentGetInitialProps,
} from '@mui/material-nextjs/v15-pagesRouter'
import { Head, Html, Main, NextScript } from 'next/document'

export default function Document(props: any) {
  return (
    <Html lang="en" data-lt-installed="true">
      <Head>
        <DocumentHeadTags {...props} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

Document.getInitialProps = async (ctx: any) => {
  const finalProps = await documentGetInitialProps(ctx)
  return finalProps
}
