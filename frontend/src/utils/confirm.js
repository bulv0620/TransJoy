export function conform(
  dialog,
  { type, title, content, positiveText, negativeText }
) {
  return new Promise((resolve, reject) => {
    dialog[type]({
      title,
      content,
      positiveText,
      negativeText,
      onPositiveClick: () => {
        resolve();
      },
      onNegativeClick: () => {
        reject();
      },
      onMaskClick: () => {
        reject();
      },
      onClose: () => {
        reject();
      },
      showIcon: false,
      positiveButtonProps: {
        type: 'error',
        secondary: true
      },
      negativeButtonProps: {
        type: 'info',
        secondary: true
      }
    });
  });
}
