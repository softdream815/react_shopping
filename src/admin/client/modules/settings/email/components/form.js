import React from 'react'
import messages from 'lib/text'

import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import {List, ListItem} from 'material-ui/List';

export default class EmailSettings extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.onLoad();
  }

  render() {
    const {emailSettings, pushUrl} = this.props;
    const smtpHint = emailSettings && emailSettings.host && emailSettings.host.length > 0 ? emailSettings.host : 'none';

    return (
      <div className="row row--no-gutter col-full-height col--no-gutter scroll">
          <div style={{padding: '10px 20px', width: '100%'}}>
          <List>
            <ListItem
              rightIcon={<FontIcon className="material-icons">keyboard_arrow_right</FontIcon>}
              primaryText={messages.settings_smtpSettings}
              secondaryText={smtpHint}
              onClick={() => { pushUrl('/admin/settings/email/smtp') }}
            />
            <Divider />
            <div className="blue-title" style={{paddingLeft: 16, paddingBottom: 16}}>{messages.settings_emailTemplates}</div>
            <ListItem
              rightIcon={<FontIcon className="material-icons">keyboard_arrow_right</FontIcon>}
              primaryText={messages.settings_orderConfirmation}
              onClick={() => { pushUrl('/admin/settings/email/templates/order_confirmation') }}
            />
            <Divider />
            <ListItem
              rightIcon={<FontIcon className="material-icons">keyboard_arrow_right</FontIcon>}
              primaryText={messages.settings_customerRegistration}
              onClick={() => { pushUrl('/admin/settings/email/templates/customer_registration') }}
            />
            <Divider />
            <ListItem
              rightIcon={<FontIcon className="material-icons">keyboard_arrow_right</FontIcon>}
              primaryText={messages.settings_customerRecovery}
              onClick={() => { pushUrl('/admin/settings/email/templates/customer_recovery') }}
            />
            <Divider />
          </List>
          </div>
      </div>
    )
  }
}
