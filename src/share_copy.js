export const shareOnTelegram = (quote, author) => {
	const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
		window.location.href
		)}&text=${encodeURIComponent(`"${quote}" - ${author}`)}`;
	window.open(telegramUrl, '_blank');
};

export const shareOnWhatsApp = (quote, author) => {
	const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(
		`${quote} - ${author}`
		)}`;
	window.open(whatsappUrl, '_blank');
};

export const copyToClipboard = (quote, author, setAlert) => {
	const textToCopy = `${quote} - ${author}`;
	if (navigator.clipboard) {
		navigator.clipboard.writeText(textToCopy)
			.then(() => {
				setAlert({
					message: 'Quote copied to clipboard',
					type: 'success',
				})
			})
			.catch((error) => {
				console.error('Failed to copy to clipboard: ', error);
				setAlert({
					message: 'Failed to copy quote to clipboard',
					type: 'error',
				})
			});
	} else {
		if (textInputRef.current) {
			textInputRef.current.value = textToCopy;
			textInputRef.current.select();
			document.execCommand('copy');
			setAlert({
				message: 'Quote copied to clipboard',
				type: 'success',
			})
		}
		textInputRef.current.value = '';
	}
  
	setTimeout(() => {
		setAlert({
			message: null,
			type: 'success',
		})
	}, 2000);
};
