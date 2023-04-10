import { get } from 'lodash';
import type { FunctionComponent } from 'react';
import React, { Children } from 'react';

export const renderNode = (Component: any, content: any, defaultProps: any = {}) => {
  if (content == null || content === false) {
    return null;
  }
  if (React.isValidElement(content)) {
    return content;
  }
  if (typeof content === 'function') {
    return content();
  }
  // Just in case
  if (content === true) {
    return <Component {...defaultProps} />;
  }
  if (typeof content === 'string') {
    if (content.length === 0) {
      return null;
    }
    return <Component {...defaultProps}>{content}</Component>;
  }
  if (typeof content === 'number') {
    return <Component {...defaultProps}>{content}</Component>;
  }
  return <Component {...defaultProps} {...content} />;
};

export const findNode = (
  children: React.ReactNode,
  name: string,
  DefaultNode: FunctionComponent<any> | null = null
) => {
  if (children == null) {
    return null;
  }

  const child = Children.toArray(children).find((child) => {
    const childName = get(child, 'type.displayName', get(child, 'type.name', ''));

    return childName === name || childName.includes(name);
  });

  if (React.isValidElement(child)) {
    return child;
  }

  if (!!DefaultNode) {
    return <DefaultNode />;
  }
  return null;
};
