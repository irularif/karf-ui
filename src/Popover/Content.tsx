import { StyleSheet } from 'react-native';
import { renderNode, RNFunctionComponent } from '../helpers';
import withConfig from '../helpers/withConfig';
import { Text } from '../Text';

export interface PopoverContentProps {
  children: React.ReactNode;
}

const _Content: RNFunctionComponent<PopoverContentProps> = ({ children, theme }) => {
  const finalTextStyle = StyleSheet.flatten([
    styles.text,
    {
      backgroundColor: theme?.colors.black,
      color: theme?.colors.white,
    },
  ]);

  return (
    <>
      {typeof children === 'string'
        ? renderNode(Text, children, {
            style: finalTextStyle,
          })
        : renderNode(children, true)}
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: '600',
    overflow: 'hidden',
  },
});

_Content.displayName = 'Popover.Content';
export const PopoverContent = withConfig(_Content);
