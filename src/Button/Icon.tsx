import { StyleSheet } from 'react-native';
import { getStyleValue, RNFunctionComponent } from '../helpers';
import withConfig from '../helpers/withConfig';
import { Icon, IconProps } from '../Icon';
import { Button } from './';
import type { ButtonProps } from './Button';

export interface ButtonIconProps extends Omit<ButtonProps, 'children'>, Omit<IconProps, 'style'> {
  rounded?: boolean;
}

const _ButtonIcon: RNFunctionComponent<ButtonIconProps> = ({
  name,
  type,
  solid,
  size = 24,
  brand,
  color,
  theme,
  rounded = true,
  variant = 'text',
  ...props
}) => {
  const _finalStyle = StyleSheet.flatten([
    styles.basic,
    {
      width: size + 12,
      height: size + 12,
    },
    rounded && {
      borderRadius: 9999,
    },
    props.style,
  ]);

  const _color =
    color ||
    getStyleValue(
      _finalStyle,
      ['backgroundColor', 'color'],
      variant === 'filled' ? theme?.colors.white : theme?.colors.primary
    );

  return (
    <Button {...props} variant={variant} style={_finalStyle}>
      <Icon
        name={name}
        type={type}
        size={size}
        brand={brand}
        solid={solid}
        color={_color}
        style={styles.icon}
      />
    </Button>
  );
};

const styles = StyleSheet.create({
  basic: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginHorizontal: 0,
  },
});

_ButtonIcon.displayName = 'Button.Icon';

export const ButtonIcon = withConfig(_ButtonIcon);
