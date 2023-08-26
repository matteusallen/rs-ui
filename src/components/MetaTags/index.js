// @flow
import React, { PureComponent } from 'react';
import { Helmet } from 'react-helmet';

type MetaTagsPropsType = {|
  canonicalPath: string,
  metaDescription: string,
  metaKeywords: string,
  metaTitle: string,
  metaTitleSuffix: string,
  shouldBeIndexed: boolean
|};

class MetaTags extends PureComponent<MetaTagsPropsType> {
  static defaultProps = {
    metaTitle: '',
    metaTitleSuffix: ' | React Boilerplate',
    metaDescription: '',
    metaKeywords: '',
    canonicalPath: '',
    shouldBeIndexed: true
  };
  getURL(locationHref: string): string {
    const urlParts = locationHref.split('/');
    return `${urlParts[0]}//${urlParts[2]}`;
  }

  getRobotsValue(): string {
    const { shouldBeIndexed } = this.props;
    return shouldBeIndexed ? 'index,follow' : 'noindex,follow';
  }

  render() {
    const baseUrl = 'https://example.com';
    const { metaTitle, metaTitleSuffix, metaDescription, metaKeywords, canonicalPath } = this.props;
    const fullMetaTitle = `${metaTitle}${metaTitleSuffix}`;
    const canonicalUrl = `${baseUrl}${canonicalPath}`;

    return (
      <Helmet>
        <title>{fullMetaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={metaKeywords} />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content={this.getRobotsValue()} />
      </Helmet>
    );
  }
}

export default MetaTags;
