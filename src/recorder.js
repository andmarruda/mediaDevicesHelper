/**
 * Records all streams from the media device
 * @version 1.0.0
 * @author  Anderson Arruda < anderson@sysborg.com.br >
 * @license MIT
 */
class recorder
{
    /**
     * Configuration of recorder
     * @param {*} mediaDevice 
     */
    constructor(mediaDevice)
    {
        this._allowedVideoTypes = {

        };

        this._allowedAudioTypes = {

        };
        
        this._mediaDevice = mediaDevice;
        this._recorder = new MediaRecorder(this.mediaDevice);
        this._data = [];
        this._time = 0;
        this._recording = false;
        this._error;
        this._limit = -1;

        var obj = this;
        this._recorder.ondataavailable = (event) => obj._data.push(event.data);
        this._recorder.onstart = () => obj._countTime();
        this._recorder.onresume = () => obj._countTime();
        this._recorder.onstop = () => obj._stopCountTime();
        this._recorder.onerror = (event) => {
            obj.stop();
            obj._error = event.name;
        }
    }

    /**
     * Set recording limit in seconds
     * @param {integer} seconds
     * @return void
     */
    setLimit(seconds){
        this._limit = seconds * 1000;
    }

    /**
     * Counts the time of recording
     * @return void
     */
    _countTime()
    {
        this._recording = true;
        var obj = this;
        this._interval = setInterval(() => {
            obj._time++;
        }, 1000);
    }

    /**
     * Stop counting time
     * @return void
     */
    _stopCountTime()
    {
        this._recording = false;
        clearInterval(this._interval);
    }
    
    /**
     * Starts to record the media device
     * @return void
     */
    start()
    {
        this._time = 0;
        this._recorder.start();
        var obj = this;

        if(this._limit > -1){
            wait(this._limit).then(() => {
                obj.stop();
            });
        }
    }

    /**
     * Resumes recording
     * @return void
     */
    resume()
    {
        this._recorder.resume();
    }

    /**
     * Stop recording
     * @return void
     */
    stop()
    {
        this._recorder.stop();
    }

    /**
     * Returns the status of recording
     * @return boolean
     */
    status()
    {
        return this._recording;
    }

    /**
     * Returns the time of recording
     * @return integer
     */
    getTime()
    {
        return this._time;
    }

    /**
     * Get error
     * @return string
     */
    getError()
    {
        return this._error;
    }
}