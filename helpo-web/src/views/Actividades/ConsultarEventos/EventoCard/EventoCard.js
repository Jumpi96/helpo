import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, Progress } from 'reactstrap';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { mapToCssModules } from 'reactstrap/lib/utils';

const propTypes = {
  header: PropTypes.string,
  mainText: PropTypes.string,
  smallText: PropTypes.string,
  color: PropTypes.string,
  value: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  cssModule: PropTypes.object,
  variant: PropTypes.string,
  link: PropTypes.string,
};

const defaultProps = {
  header: '89.9%',
  mainText: 'Lorem ipsum...',
  smallText: 'Lorem ipsum dolor sit amet enim.',
  // color: '',
  link: '#',
  value: '25',
  variant: '',
};

class EventoCard extends Component {
  render() {
    const { className, cssModule, header, mainText, smallText, color, value, children, variant, link, ...attributes } = this.props;

    // demo purposes only
    const progress = { style: '', color: color, value: value };
    const card = { style: '', bgColor: '' };

    if (variant === 'inverse') {
      progress.style = 'progress-white';
      progress.color = '';
      card.style = 'text-white';
      card.bgColor = 'bg-' + color;
    }

    const classes = mapToCssModules(classNames(className, card.style, card.bgColor), cssModule);
    progress.style = classNames('progress-xs my-3', progress.style);

    return (
      <Card className={classes} {...attributes}>
        <CardBody>
        <div>
          <img 
              src="https://i1.wp.com/alianzaong.org.do/wp-content/uploads/2018/02/Dise%C3%B1o-sin-t%C3%ADtulo-1.png" alt="Girl in a jacket" 
              style={{width:'100px', height:'100px'}} 
          />
          <div className="h4 m-0">{header}</div>
          <div>{mainText}</div>
          <Progress className={progress.style} color={progress.color} value={progress.value} />
          <small className="text-muted">{smallText}</small>
          <Link to={link}>
            <button className="btn btn-primary pull-right">
              Ver más
            </button>
          </Link>
        </div>
        </CardBody>
      </Card>
    );
  }
}

EventoCard.propTypes = propTypes;
EventoCard.defaultProps = defaultProps;

export default EventoCard;
