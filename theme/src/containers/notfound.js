import React, { Fragment } from 'react';
import { themeSettings, text } from '../lib/settings';
import MetaTags from '../components/metaTags';

const NotFoundContainer = props => (
	<Fragment>
		<MetaTags title={text.title404} />
		<section className="section">
			<div className="container">
				<div className="content">
					<h1>{text.title404}</h1>
					{text.text404}
				</div>
			</div>
		</section>
	</Fragment>
);

export default NotFoundContainer;
