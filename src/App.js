import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import BookmarkedQuotes from './components/BookmarkedQuotes';
import QuoteBox from './components/QuoteBox';
import Alert from './components/Alert';
import { shareOnTelegram, shareOnWhatsApp, copyToClipboard } from './share_copy';

const App = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
	const [quoteData, setQuoteData] = useState({
		quote: '',
		author: '',
		saved: false,
		tags: [],
	});
    const [countdown, setCountdown] = useState(30);
    const [isPaused, setIsPaused] = useState(false);
	const [red, setRed] = useState(false);
	const [savedQuotes, setSavedQuotes] = useState([]);
	const [showSavedQuotes, setShowSavedQuotes] = useState(false);
	const [alert, setAlert] = useState({
		message: null,
		type: 'success',
	})

	const textInputRef = useRef(null);

	const saveQuote = () => {
		const newSavedQuote = { quote: quoteData.quote, author: quoteData.author };
		setSavedQuotes((prevSavedQuotes) => [...prevSavedQuotes, newSavedQuote]);
		localStorage.setItem('savedQuotes', JSON.stringify([...savedQuotes, newSavedQuote]));
	};

	const handleSaveQuote = useCallback(() => {
		const isQuoteSaved = savedQuotes.some((quoteObj) => quoteObj.quote === quoteData.quote);
		if (!isQuoteSaved) {
			saveQuote();
			setQuoteData({...quoteData, saved: true});
			setAlert({
				message: 'Quote saved',
				type: 'success',
			})
		} else {
			const updatedSavedQuotes = savedQuotes.filter((quoteObj) => quoteObj.quote !== quoteData.quote);	
			setSavedQuotes(updatedSavedQuotes);
			localStorage.setItem('savedQuotes', JSON.stringify(updatedSavedQuotes));
			setQuoteData({...quoteData, saved: false});
			setAlert({
				message: 'Quote removed',
				type: 'error',
			})
		}
		setTimeout(() => {
			setAlert({
				message: null,
				type: 'success',
			})
		}, 1500);
	}, [savedQuotes, quoteData.quote, quoteData.saved]);

    const fetchNewQuote = () => {
        setIsLoading(true);
        setError(null);

        fetch('http://api.quotable.io/random')
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch quote. Please try again in a while!');
                }
                return res.json();
            })
            .then((data) => {
                setQuoteData({
					quote: data.content,
					author: data.author,
					tags: data.tags,
					saved: false,
				})
                setIsLoading(false);
				setCountdown(30);
				setIsPaused(false);
            })
            .catch( (error) => {
                setError('Failed to fetch quote. Please check your internet connection!');
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchNewQuote();
    }, []);

    useEffect(() => {
        let timer;

        if (!showSavedQuotes && !isPaused && !error) {
            timer = setInterval(() => {
                setCountdown((prevCountdown) => (prevCountdown > 0 ? prevCountdown - 1 : 30));
            }, 1000);
        }

		if (countdown <= 10 && countdown % 2 == 0) setRed(true);
		else setRed(false);

        if (countdown === 0) {
            fetchNewQuote();
            setCountdown(30);
        }

        return () => clearInterval(timer);
    }, [countdown, isPaused, error, showSavedQuotes]);

    const togglePause = () => {
        setIsPaused((prevIsPaused) => !prevIsPaused);
    };  

    return (
		<>
		{ !showSavedQuotes ?
			<>
				<h1 className='title'>Quote Generator</h1>
				<QuoteBox
					isLoading={isLoading}
					error={error}
					quote={quoteData.quote}
					author={quoteData.author}
					tags={quoteData.tags}
					isPaused={isPaused}
					saved={quoteData.saved}
					countdown={countdown}
					textInputRef={textInputRef}
					showSavedQuotes={showSavedQuotes}
					setShowSavedQuotes={setShowSavedQuotes}
					red={red}
					togglePause={togglePause}
					handleSaveQuote={handleSaveQuote}
					copyToClipboard={copyToClipboard}
					shareOnTelegram={shareOnTelegram}
					shareOnWhatsApp={shareOnWhatsApp}
					handleFetchNewQuote={fetchNewQuote}
					setAlert={setAlert}
				/>
			</>
			:
			<BookmarkedQuotes
				savedQuotes={savedQuotes}
				setSavedQuotes={setSavedQuotes}
				showSavedQuotes={showSavedQuotes}
				setShowSavedQuotes={setShowSavedQuotes}
				setQuoteData={setQuoteData}
				quoteData={quoteData}
				setAlert={setAlert}
			/>
		}
		{ alert.message && <Alert message={alert.message} type={alert.type} /> }
		</>
    );
};

export default App;