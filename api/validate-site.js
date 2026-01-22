export default (req, res) => {
    const isIpCheckEnabled = process.env.IS_IPCHECK_ING === 'IP.sb';
    res.status(200).json({ isIpCheckEnabled });
};
