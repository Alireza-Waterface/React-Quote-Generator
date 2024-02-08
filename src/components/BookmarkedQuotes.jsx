import {useCallback} from "react";

const BookmarkedQuotes = ({
	savedQuotes,
	setSavedQuotes,
	showSavedQuotes,
	setShowSavedQuotes,
	setQuoteData,
	quoteData,
	setAlert,
}) => {
	const bookmarkedQuotes = JSON.parse(localStorage.getItem('savedQuotes')) || [];

	const handleDeleteQuote = useCallback((index) => {
		const updatedSavedQuotes = savedQuotes.filter((_, i) => i !== index);
		setSavedQuotes(updatedSavedQuotes);
		localStorage.setItem('savedQuotes', JSON.stringify(updatedSavedQuotes));
		setQuoteData({
			...quoteData,
			saved: !quoteData.saved,
		})
		setAlert({
			message: 'Quote removed',
			type: 'error',
		})
	
		setTimeout(() => {
			setAlert({
				message: null,
				type: 'success',
			})
		}, 1500);
	}, [savedQuotes]);

	return (
		<div className="saved-quotes">
			<h1 className="saved-title">Saved Quotes</h1>
			{
				bookmarkedQuotes.length > 0 ?
					<ul className="quotes-list">
					{
						bookmarkedQuotes.map((quoteObj, index) => (
							<li key={index} className='saved-quote-content'>
								<p>
									{`${quoteObj.quote}`}
									<br />
									{` - ${quoteObj.author}`}
								</p>
								<button
									className="btn-grad delete-btn"
									onClick={() => handleDeleteQuote(index)}
								>
									<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
								</button>
							</li>
						))
					}
					</ul>
					:
					<p className='no-quote'>
						No quotes saved yet!
						<br />
						Use the bookmark button
						' <svg xmlns="http://www.w3.org/2000/svg" fill='#fff' height="1em" viewBox="0 0 384 512"><path d="M0 48C0 21.5 21.5 0 48 0l0 48V441.4l130.1-92.9c8.3-6 19.6-6 27.9 0L336 441.4V48H48V0H336c26.5 0 48 21.5 48 48V488c0 9-5 17.2-13 21.3s-17.6 3.4-24.9-1.8L192 397.5 37.9 507.5c-7.3 5.2-16.9 5.9-24.9 1.8S0 497 0 488V48z"/></svg> '
						to save your favorite quotes here!
					</p>
			}
			<button className='btn-grad show-saved-btn' onClick={() => setShowSavedQuotes(!showSavedQuotes)}>
				{
					showSavedQuotes ? 'Go back' : ''
				}
			</button>
		</div>
	);
};

export default BookmarkedQuotes;