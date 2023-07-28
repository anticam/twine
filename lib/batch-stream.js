import through2 from 'through2';

const batchStream = (batchSize = 10) => {
    let batch = []
    return through2.obj(
        (chunk, enc, next) => {
            batch.push(chunk)
            if (batch.length === batchSize) {
                let data = batch
                batch = []
                next(null, data)
            } else {
                next()
            }

        },
        (next) => {
            if (batch.length > 0) {
                next(null, batch)
            } else {
                next()
            }
        }
    )
}

export default batchStream