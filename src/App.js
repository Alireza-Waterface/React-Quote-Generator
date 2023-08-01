import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import BookmarkedQuotes from './components/BookmarkedQuotes';
import QuoteBox from './components/QuoteBox';

const App = () => {
    const [quote, setQuote] = useState('');
    const [author, setAuthor] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tags, setTags] = useState([]);
    const [countdown, setCountdown] = useState(30);
    const [isPaused, setIsPaused] = useState(false);
	const [red, setRed] = useState(false);
	const [savedQuotes, setSavedQuotes] = useState([]);
	const [showSavedQuotes, setShowSavedQuotes] = useState(false);
	const [saved, setSaved] = useState(false);
	const [alertMessage, setAlertMessage] = useState(null);
	const [alertType, setAlertType] = useState('success');

	const textInputRef = useRef(null);

	const saveQuote = () => {
		const newSavedQuote = { quote, author };
		setSavedQuotes((prevSavedQuotes) => [...prevSavedQuotes, newSavedQuote]);
		localStorage.setItem('savedQuotes', JSON.stringify([...savedQuotes, newSavedQuote]));
	};

	const handleSaveQuote = useCallback(() => {
		const isQuoteSaved = savedQuotes.some((quoteObj) => quoteObj.quote === quote);
		if (!isQuoteSaved) {
			saveQuote();
			setSaved(!saved);
			setAlertMessage('Quote saved');
			setAlertType('success');
		} else {
			const updatedSavedQuotes = savedQuotes.filter((quoteObj) => quoteObj.quote !== quote);
			setSavedQuotes(updatedSavedQuotes);
			localStorage.setItem('savedQuotes', JSON.stringify(updatedSavedQuotes));
			setSaved(!saved);
			setAlertMessage('Quote removed');
			setAlertType('error');
		}
		setTimeout(() => {
			setAlertMessage(null);
		}, 1500);
	}, [savedQuotes, quote, saved]);

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
                setQuote(data.content);
                setAuthor(data.author);
                setTags(data.tags);
                setIsLoading(false);
				setSaved(false);
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

    const handleFetchNewQuote = () => {
        fetchNewQuote();
        setCountdown(30);
		setIsPaused(false);
    };

    const togglePause = () => {
        setIsPaused((prevIsPaused) => !prevIsPaused);
    };

    const shareOnTelegram = () => {
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
            window.location.href
            )}&text=${encodeURIComponent(`"${quote}" - ${author}`)}`;
        window.open(telegramUrl, '_blank');
    };

    const shareOnWhatsApp = () => {
        const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(
            `"${quote}" - ${author}`
            )}`;
        window.open(whatsappUrl, '_blank');
    };

	const copyToClipboard = () => {
		const textToCopy = `"${quote}" - ${author}`;
		if (navigator.clipboard) {
			navigator.clipboard.writeText(textToCopy)
				.then(() => {
					setAlertMessage('Quote copied to clipboard');
					setAlertType('success');
				})
				.catch((error) => {
					console.error('Failed to copy to clipboard: ', error);
					setAlertMessage('Failed to copy quote to clipboard');
					setAlertType('error');
				});
		} else {
			if (textInputRef.current) {
				textInputRef.current.value = textToCopy;
				textInputRef.current.select();
				document.execCommand('copy');
				setAlertMessage('Quote copied to clipboard');
				setAlertType('success');
			}
			textInputRef.current.value = '';
		}
	  
		setTimeout(() => {
		  setAlertMessage(null);
		}, 2000);
	};

	const Alert = ({ message, type }) => {
		return (
		  	<p className={`alert ${type === 'error' ? 'error' : 'success'} show`}>{message}</p>
		);
	};	  

    return (
		<>
		{ !showSavedQuotes ?
			<>
				<h1 className='title'>Quote Generator</h1>
				<QuoteBox
					isLoading={isLoading}
					error={error}
					quote={quote}
					author={author}
					tags={tags}
					isPaused={isPaused}
					saved={saved}
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
					handleFetchNewQuote={handleFetchNewQuote}
				/>
			</>
			:
			<BookmarkedQuotes
				savedQuotes={savedQuotes}
				setSavedQuotes={setSavedQuotes}
				showSavedQuotes={showSavedQuotes}
				setShowSavedQuotes={setShowSavedQuotes}
				setSaved={setSaved}
				setAlertMessage={setAlertMessage}
				setAlertType={setAlertType}
			/>
		}
		{alertMessage && <Alert message={alertMessage} type={alertType} />}
		</>
    );
};

export default App;