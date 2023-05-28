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
            mp4: 'video/mp4',
            mpeg: 'video/mpeg',
            ogv: 'video/ogg',
            webm: 'video/webm'
        };

        this._allowedAudioTypes = {
            aac: 'audio/aac',
            mp3: 'audio/mpeg',
            wav: 'audio/wav',
            oga: 'audio/ogg',
            weba: 'audio/webm'
        };

        this._mediaDevice = mediaDevice;
        this._recorder = new MediaRecorder(this._mediaDevice);
        this._data = [];
        this._time = 0;
        this._recording = false;
        this._error;
        this._limit = -1;
        this._dataAvailable = false;

        var obj = this;
        this._recorder.addEventListener('dataavailable', (event) => {
            obj._data.push(event.data);
        });
        this._recorder.onstart = () => obj._countTime();
        this._recorder.onresume = () => obj._countTime();
        this._recorder.onstop = () => {
            obj._stopCountTime();
            obj._dataAvailable = true;
            console.log(obj._data);
            console.log(obj._dataAvailable);
        }
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
        this._dataAvailable = false;
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

    /**
     * Get blob of recording
     * @param {string} extension
     * @return Blob
     */
    getBlob(extension)
    {
        if(this.status())
            this.stop();

        var obj = this;
        return new Promise((resolve) => {
            const check = () => {
                if(obj._dataAvailable){
                    resolve(new Blob(obj._data, {type: obj._allowedAudioTypes[extension] || obj._allowedVideoTypes[extension]}));
                }else{
                    setTimeout(check, 100);
                }
            };

            check();
        });
    }

    /**
     * Get only audio
     * @param {string} extension
     * @return File
     */
    async getAudio(extension)
    {
        const blob = await this.getBlob(mimeType);
        return new File([blob], `audio.${extension}`, {type: this._allowedAudioTypes[extension], lastModified: Date.now()});
    }

    /**
     * Get video
     * @param {string} extension
     * @return File
     */
    async getVideo(extension)
    {
        const blob = await this.getBlob(extension);
        return new File([blob], `video.${extension}`, {type: this._allowedVideoTypes[extension], lastModified: Date.now()});
    }

    /**
     * Has some record
     * @return boolean
     */
    hasRecord()
    {
        return this._data.length > 0;
    }
}